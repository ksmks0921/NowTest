import moment from 'moment'
import { BaseModel } from './basemodel'
import { Customer } from './customer'
import { User } from './user'
import { Product } from './product'
import { Staff } from './staff'
import { Utils } from './utils'

export const dotActive = {
  circleColor: 'green',
  circleSize: 20
}

export const lineActive = {
  lineColor: 'green'
}

export enum OrderLogTypes {
    TAILORS_RECEIVED = 1,
    TAILORS_REMOVED = 2,
    TAILORS_ASSIGNED = 3,
    TAILORS_COMPLETE = 4,
    TAILORS_UNCOMPLETE = 5,
    TIMER_START = 6,
    TIMER_STOP = 7,
    COMPLETE = 8,
    INCOMPLETE = 9,
    TAILORS_PRINT = 10,
    RETURNCOMPLETE = 11
}

export class Order extends BaseModel {

  static fields = {

    user: { type: 'ref', ref:User },

    customer: { type: 'ref', ref:Customer },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    parameters: {
      subfields: {
        measurements: { type: 'boolean' },
        problems: { type: 'boolean' },
        paid: { type: 'boolean' },
        complete: { type: 'boolean' },
        return: { type: 'boolean' },
        advanceamount: { type: 'number' }
      }
    },

    members: {
      subfields: {
        measurement: { type: 'ref', ref:Staff },
        guidance: { type: 'ref', ref:Staff },
        tailor: { type: 'ref', ref:Staff }
      }
    },

    shipping: {
      subfields: {
        address: { type: 'string' },
        phone: { type: 'string' },
        delivery: { type: 'boolean' },
        takeout: { type: 'boolean' },
        date: { type: 'date' }
      }
    },

    tailors: {
      subfields: {
        view: { type: 'boolean' },
        assigned: { type: 'boolean' },
        processed: { type: 'boolean' },
        timer: { type: 'boolean' },
        complete: { type: 'boolean' },
        deadline: { type: 'date' },
      }
    }

  }

  static methods = {
    getDeadlineDays: function(){
      return this.tailors.deadline ? this.tailors.deadline.diff(moment(), 'days') : 0
    },
    getDeadline: function(format){
      if(!format) return this.tailors.deadline || ''
      return this.tailors.deadline ? this.tailors.deadline.format(format) : '-'
    },
    getShippingDate: function(format){
      if(!format) return this.shipping.date || ''
      return this.shipping.date ? this.shipping.date.format(format) : '-'
    },
    getPaidDetails: function(){
      return this.parameters.paid ? 'Achiata' : this.parameters.advanceamount ? ['A platit avans', this.parameters.advanceamount].join(' ') : 'Nu a fost achitata'
    },
    getShippingMethodDetails: function(){
      return this.shipping.takeout ? 'Ridicare din magazin' : 'Expediere'
    },
    delete: function(){
        console.log('Delete the order -> ', this._id)
        return Order.deleteApi(Order, Order.getModelKey(this))
    }
  }

  static disableCache = true

  static collectionName = 'orders'

  static findAll(forceRefresh: Bool) {
    return BaseModel._findAll(Order, ...arguments)
  }

  static async findAllForTailors(){
    return BaseModel._findAllBy(Order, 'tailors.view', true)
  }

  static findOne() {
    return BaseModel._findOneBy(Order, '_id', ...arguments)
  }

  static new() {
    return BaseModel._new(Order, ...arguments)
  }

  static update() {
    return BaseModel._update(Order, ...arguments)
  }

  static findByEmail(){
    return BaseModel._findOneBy(Order, 'email', ...arguments)
  }

  static async getProcessingMinutes(orderLogs){

    if(!orderLogs.length) return 0

    const onlyTimerLogs = orderLogs.filter((item) => {
      return item.type == OrderLogTypes.TIMER_START || item.type == OrderLogTypes.TIMER_STOP
    })

    const sortedLogs = Utils.sortByField(onlyTimerLogs, 'createdAt')

    var totalTime = 0
    var tempStartTime = null

    for(var timeLog of sortedLogs){

      if(tempStartTime && timeLog.type == OrderLogTypes.TIMER_STOP){

        const tempDuration = moment.duration(timeLog.createdAt.diff(tempStartTime))

        if(tempDuration.asMinutes()){
          totalTime += tempDuration.asMinutes()
        }

        tempStartTime = null
      }
      else{
        tempStartTime = timeLog.createdAt
      }

    }

    return totalTime
  }

  static async getTimeline(order, orderLogs){

    var orderTimeline = [{
        date: order.createdAt,
        title: 'Comanda a fost adaugata',
        description: 'Se astepta ca un operator sa faca un review.',
        ...dotActive,
        ...lineActive
      }
    ]

    var reviews = await Order.getReviews(order)
    reviews = Utils.sortByField(reviews, 'createdAt')

    for(var reviewIndex in reviews){

      const review = reviews[reviewIndex]

      var description = await Order.getReviewContent(review)

      var title = [review.user.getFullName(), reviewIndex == 0 ? 'a adaugat produsele' : 'a modificat masurile'].join(' ')

      orderTimeline.push({
        date: review.createdAt,
        title: title,
        description: description,
        ...dotActive,
        ...lineActive
      })

    }

    orderLogs = Utils.sortByField(orderLogs, 'createdAt')

    for(var log of orderLogs){

      var logTitle = "Unkown"
      var logDescription = "."

      switch(log.type) {
        case OrderLogTypes.TAILORS_RECEIVED: {
          logTitle = [log.user.getFullName(), "a trimis comanda la departamentul CROITORIE"].join(' ')
          break;
        }
        case OrderLogTypes.TAILORS_REMOVED: {
          logTitle = [log.user.getFullName(), "a retras comanda de la departamentul CROITORIE"].join(' ')
          break;
        }
        case OrderLogTypes.TAILORS_ASSIGNED: {
          logTitle = "CROITORIE - " + [log.user.getFullName(), "a atribuit un croitor comenzii"].join(' ')
          let tailor = await Staff.findOne(log.data)
          if(tailor){
            logDescription = "Croitorul atribuit comenzii este : " + tailor.getFullName()
          }
          break;
        }
        case OrderLogTypes.TIMER_START: {
          logTitle = "CROITORIE - " + [log.user.getFullName(), "In lucru"].join(' - ')
          let tailor = await Staff.findOne(log.data)
          if(tailor){
            logDescription = "Croitorul " + tailor.getFullName() + " a inceput sa lucreze la aceasta comanda"
          }
          break;
        }
        case OrderLogTypes.TIMER_STOP: {
          logTitle = "CROITORIE - " + [log.user.getFullName(), "Stop lucru "].join(' - ')
          let tailor = await Staff.findOne(log.data)
          if(tailor){
            logDescription = "Croitorul " + tailor.getFullName() + " a terminat aceasta comanda"
          }
          break;
        }
        case OrderLogTypes.TAILORS_COMPLETE: {
          logTitle = "CROITORIE - " + [log.user.getFullName(), "Pregatita pentru expediere"].join(' - ')
          logDescription = "Comanda a fost finalizata si asteapta expedierea"
          break;
        }
        case OrderLogTypes.TAILORS_UNCOMPLETE: {
          logTitle = [log.user.getFullName(), "A marcat comanda ca nefinalizata"].join(' - ')
          break;
        }
        case OrderLogTypes.COMPLETE: {
          logTitle = [log.user.getFullName(), "A marcat comanda ca finalizata"].join(' - ')
          break;
        }
        case OrderLogTypes.INCOMPLETE: {
          logTitle = [log.user.getFullName(), "A marcat comanda ca gresita. Se asteapta sosirea produselor"].join(' - ')
          break;
        }
        case OrderLogTypes.TAILORS_PRINT: {
          logTitle = "CROITORIE - " + [log.user.getFullName(), "A printat "].join(' - ')
          let tailor = await Staff.findOne(log.data)
          if(tailor){
            logDescription = "Croitorul " + tailor.getFullName() + " va primi fisa comenzii"
          }
          break;
        }
        case OrderLogTypes.RETURNCOMPLETE: {
          logTitle = [log.user.getFullName(), "A primit produsele de la client. Se va incepe procedura de reprocesare"].join(' - ')
          break;
        }
        default: {
          //statements;
          break;
        }
      }

      orderTimeline.push({
        date: log.createdAt,
        title: logTitle,
        description: logDescription,
        ...dotActive,
        ...lineActive
      })

    }

    return Utils.sortByField(orderTimeline, 'date', true)
  }

  static getStatus(order){

    if(order.tailors.view){

      if(!order.tailors.assigned){
        return { color: 'warning', text: 'Asteapta sa fie asignat un croitor' }
      }

      else{

        if(order.tailors.timer){
          return { color: 'info', text: 'In lucru' }
        }
        else{
          return { color: 'warning', text: 'In asteaptare' }
        }

      }

    }
    else{

      if(order.parameters.return){
        return { color: 'danger', text: 'Se asteapta produsele' }
      }

      if(order.parameters.complete){
        return { color: 'success', text: 'Finalizata' }
      }

      else if(order.tailors.complete){

        if(order.shipping.delivery){
          return { color: 'info', text: 'Pregatita pentru expediere' }
        }

        else if(order.shipping.takeout){
          return { color: 'info', text: 'Pegatita pentru ridicare din magazin' }
        }

        else{
          return { color: 'info', text: 'Finalizata de croitorie. Nu se cunoaste modalitatea de livrare' }
        }

      }

      else if(order.parameters.measurements){
        return { color: 'warning', text: 'Asteapta sa fie trimisa la CROITORIE' }
      }

      else{
        return { color: 'primary', text: 'Se astepta introducerea masurilor' }
      }
    }

  }

  static async getReviewContent(review, lineEnd){

    if(!lineEnd){
      lineEnd = "\n";
    }

    var reviewContent = ''

    for(var orderProduct of review.products){

      let measurements = orderProduct.measurements

      let product = await Product.findOne(orderProduct.product)

      if(!product){
        reviewContent += ['Produs inexistent', orderProduct.product, lineEnd].join('')
        continue
      }

      var skuCodeText = '- '
      if(orderProduct.sku){
        skuCodeText = ['Cod: ', orderProduct.sku].join('')
      }

      if(orderProduct.size){
        skuCodeText += [orderProduct.sku ? ' -> ': '', 'Marime: ', orderProduct.size].join('')
      }

      reviewContent += [product.name, skuCodeText, lineEnd].join(' ')

      if(!measurements){
        reviewContent += lineEnd
        continue
      }

      for(var section of product.sections){

        var backupContent = ''

        for(var field of section.fields){

          var measurement = Utils.findFirst(measurements, 'field', field._id)

          if(!measurement) continue

          backupContent += ["   ~~ ", field.name, ': ', measurement.value, lineEnd].join('')

        }

        if(backupContent){
          reviewContent += [" - ", section.title, lineEnd].join('')
          reviewContent += backupContent
        }

      }

      reviewContent += lineEnd

    }

    return reviewContent
  }

  static async addLog(order, type, data){

    console.log("Add order log: ", order, type, data)

    return await Order.postApi(Order, [Order.getModelKey(order), 'logs'].join('/'), {
      type : type,
      data: data
    })

  }

  static async sendToTailors(order, mode){

    console.log("Send order to tailors: ", order, mode ? "yes" : "no")

    return await Order.postApi(Order, [Order.getModelKey(order), 'tailors'].join('/'), {
      key : 'view',
      value: mode
    })

  }

  static async setTailor(order, tailor){

    console.log("Set order tailor ", order, tailor)

    return await Order.postApi(Order, [Order.getModelKey(order), 'members'].join('/'), {
      key : 'tailor',
      value: Order.getModelKey(tailor)
    })

  }

  static async setTimer(order, mode){

    console.log("Set tailor timer mode: ", order, mode)

    return await Order.postApi(Order, [Order.getModelKey(order), 'tailors'].join('/'), {
      key : 'timer',
      value: mode
    })

  }

  static async setTailorsComplete(order, mode){

    console.log("Set tailor complete", order, mode ? 'complete' : 'uncomplete')

    return await Order.postApi(Order, [Order.getModelKey(order), 'tailors'].join('/'), {
      key : 'complete',
      value: mode
    })

  }

  static async completeOrder(order){

    console.log("Set order as complete for %s", order)

    return await Order.postApi(Order, [Order.getModelKey(order), 'parameters'].join('/'), {
      key : 'complete',
      value: true
    })
  }

  static async incompleteOrder(order){

    console.log("Set order as incomplete for %s", order)

    return await Order.postApi(Order, [Order.getModelKey(order), 'parameters'].join('/'), {
      key : 'complete',
      value: false
    })

  }

  static async receivedProducts(order){

    console.log("Set order as received products for %s", order)

    return await Order.postApi(Order, [Order.getModelKey(order), 'parameters'].join('/'), {
      key : 'return',
      value: false
    })

  }

  static async getProducts(order){

    var orderId = Order.getModelKey(order)

    console.log("Get order products %s", orderId)

    var reviews = await Order.getReviews(order)

    var activeReview = Utils.findFirst(reviews, 'active', true)

    if(!activeReview){
      return []
    }

    return activeReview.products

  }

  static async addReview(order, products){

    var orderId = Order.getModelKey(order)

    console.log("Add order %s -> review : %s products", orderId, products.length)

    return await Order.postApi(Order, [orderId, 'reviews'].join('/'), products)

  }

  static async getReviews(order){

    var orderId = Order.getModelKey(order)

    console.log("Get order reviews %s", orderId)

    var reviews = await Order.getApi(Order, [orderId, 'reviews'].join('/'))

    for(var review of reviews){

      var user = await User.findOne(review.user)
      if(user){
        review.user = user
      }

      review.updatedAt = moment(review.updatedAt)
      review.createdAt = moment(review.createdAt)

    }

    return reviews

  }

  static async getLogs(order){

    var orderId = Order.getModelKey(order)

    console.log("Get order logs %s", orderId)

    var logs = await Order.getApi(Order, [orderId, 'logs'].join('/'))

    for(var log of logs){

      var user = await User.findOne(log.user)
      if(user){
        log.user = user
      }

      log.updatedAt = moment(log.updatedAt)
      log.createdAt = moment(log.createdAt)

    }

    return logs

  }

}

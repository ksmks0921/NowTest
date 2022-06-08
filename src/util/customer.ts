import { BaseModel } from './basemodel'
import { Product } from './product'
import { Utils } from './utils'

export class Customer extends BaseModel {

  static collectionName = 'customers'

  //static disableCache = true

  static fields = {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    age: { type: 'number' },
    married: { type: 'boolean' },
    height: { type: 'number' },
    weight: { type: 'number' },
    profession: { type: 'string' },
    fashion: { type: 'string' },
    brands: { type: 'string' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' }
  }

  static methods = {
    getFullName: function(){
      return [this.firstName, this.lastName].join(' ')
    },
    getHeight: function(){
      return this.height ? this.height : '-'
    },
    getWeight: function(){
      return this.weight ? this.weight : '-'
    },
  }

  static findAll(forceRefresh: Bool) {
    return BaseModel._findAll(Customer, ...arguments)
  }

  static findOne() {
    return BaseModel._findOneBy(Customer, '_id', ...arguments)
  }

  static new() {
    return BaseModel._new(Customer, ...arguments)
  }

  static on() {
    return BaseModel._new(Customer, ...arguments)
  }

  static findOneByEmail(){
    return BaseModel._findOneBy(Customer, 'email', ...arguments)
  }

  static async getMeasurements(customer){

    var customerId = Customer.getModelKey(customer)

    console.log("Get customer measurements %s", customerId)

    return await Customer.getApi(Customer, [customerId, 'measurements'].join('/'))

  }

  static async getProductsSizes(customer){

    var customerId = Customer.getModelKey(customer)

    console.log("Get customer product sizes %s", customerId)

    return await Customer.getApi(Customer, [customerId, 'products', 'sizes'].join('/'))

  }

  static async getReport(height: number = 0, weight: number = 0){

    console.log("Get customer report for %scm, %skg %s", height, weight)

    return await Customer.getApi(Customer, ['reports', height, weight].join('/'))

  }

  static async getMeasurementsContent(measurements: any[], productSizes:any[], lineEnd?: string){

    if(!lineEnd){
      lineEnd = "\n";
    }

    let reviewProducts: any[] = [];

    let products = await Product.findAll();

    for(var product of products){

      let productData = {
          product,
          content: '',
          size: ''
      }

      let productSize = Utils.findFirst(productSizes, '_id', product._id);
      if(productSize){
          productData.size = productSize.size;
      }

      if(!measurements.length){
        continue
      }

      let sectionsContent = '';

      for(var section of product.sections){

        var backupContent = ''

        for(var field of section.fields){

          var measurement = Utils.findFirst(measurements, '_id', field._id)

          if(!measurement) continue

          backupContent += ["   ~~ ", field.name, ': ', measurement.value, lineEnd].join('')

        }

        if(backupContent){
          sectionsContent += [" - ", section.title, lineEnd].join('')
          sectionsContent += backupContent
        }

      }

      if(sectionsContent){
          productData.content += sectionsContent;
      }

      reviewProducts.push(productData);

    }

    return reviewProducts;

  }

}

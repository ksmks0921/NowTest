/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { Component } from 'react'

import { connect } from 'react-redux'

import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import { Badge } from 'react-native-elements'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'

import Timeline from 'react-native-timeline-listview'
import Screen from '../../ui/components/Screen'
import * as Theme from '../../theme'

import Button from '../../ui/components/Button'
import Icon from '../../ui/components/Icon'
import List from '../../ui/components/list/List'
import ListHeader from '../../ui/components/list/ListHeader'
import SimpleListItem from '../../ui/components/list/SimpleListItem'

import { User } from '../../util/user'
import { Order } from '../../util/order'
import { Customer } from '../../util/customer'
import { Staff } from '../../util/staff'
import { Product } from '../../util/product'

const styles = StyleSheet.create({

})

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  dispatch: (Object) => any,
  navigation: NavigationScreenProp
}

/*
 * We use flow type to validate the State of the component
 */
type State = {
  user: Object,
  order: Object,
  orderTimeline: Array,
  customers: Array,
  orderTotalProcessingTime: Number
}

class OrderDetails extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Detalii comanda',
  }

  constructor(props: Props, context: any) {

    super(props, context)

    this.state = {
      user: global.user,
      order: null,
      orderTimeline: [],
      customers: [],
      orderTotalProcessingTime: 0
    }
  }

  async componentWillMount(){

    this.props.dispatch(showLoading())

  }

  componentDidMount(){

    var orderId = this.props.navigation.getParam('orderId', null)

    this.setState({ orderId: orderId }, () => {

      this.reloadOrder()

    })

  }

  goToReview = () => {
    this.props.navigation.navigate('OrderReview', {
      orderId: this.state.order._id
    })
  }

  setTailorsDisplay = async (mode) => {

    this.props.dispatch(showLoading())

    await Order.sendToTailors(this.state.order._id, mode)

    await this.reloadOrder()

  }

  sendToTailors = () => {
    this.setTailorsDisplay(true)
  }

  hideFromTailors = () => {
    this.setTailorsDisplay(false)
  }

  markAsComplete = async () => {
    this.props.dispatch(showLoading())

    await Order.completeOrder(this.state.order._id)

    await this.reloadOrder()
  }

  markAsIncomplete = async () => {
    this.props.dispatch(showLoading())

    await Order.incompleteOrder(this.state.order._id)

    await this.reloadOrder()
  }

  receivedProducts = async () => {
    this.props.dispatch(showLoading())

    await Order.receivedProducts(this.state.order._id)

    await this.reloadOrder()
  }

  reloadOrder = async () => {

    let order = await Order.findOne(this.state.orderId)

    var orderLogs = await Order.getLogs(order)

    var orderTimeline = await Order.getTimeline(order, orderLogs)

    let orderStatus = Order.getStatus(order)

    let orderTotalProcessingTime = await Order.getProcessingMinutes(orderLogs)

    this.setState({ order, orderTimeline, orderStatus, orderTotalProcessingTime })

    this.props.dispatch(hideLoading())

  }

  renderTime(rowData, sectionID, rowID) {
    return (
      <View style={{ alignItems: "flex-end" }}>
        <View style={[styles.timeContainer, this.props.timeContainerStyle]}>
          <View style={[styles.time, this.props.timeStyle]}>
            <Text style={[this.props.timeTextStyle, {textAlign: 'center'}]}>
              { rowData.date.format('HH:MM') + "\n" }
              <Text style={[this.props.timeTextStyle, {fontSize: 10}]}>{rowData.date.format('DD/MM/YYYY')}</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {

    const { order, orderTimeline, orderStatus, orderTotalProcessingTime } = this.state

    return (
      <Screen style={{paddingTop: 50}}>

        { order && (

        <ScrollView>

          <View style={{flex: 1, flexDirection:'column', alignItems: 'center', marginTop: 15}}>

            <Badge containerStyle={ Theme.badgeStyle[orderStatus.color + 'Container'] }>
              <Text style={ Theme.badgeStyle[orderStatus.color + 'Text'] }>{ orderStatus.text }</Text>
            </Badge>

            <Text style={{fontSize:11, color: 'gray'}}>Status comanda</Text>
          </View>

          <List>

            <SimpleListItem
              text={ order.customer.getFullName() }
              subtext="Nume client"
            />

            <SimpleListItem
              text={ order.customer.getHeight() }
              subtext="Inaltime"
            />

            <SimpleListItem
              text={ order.customer.getWeight() }
              subtext="Greutate"
            />

            <SimpleListItem
              text={ order.shipping.phone }
              subtext="Telefon"
            />

            <SimpleListItem
              text={ order.customer.email }
              subtext="Email"
            />

            <SimpleListItem
              text={ order.shipping.address }
              subtext="Adresa"
            />

            <SimpleListItem
              text={ order.members.guidance ? order.members.guidance.getFullName() : '-' }
              subtext="Consilier"
            />

            <SimpleListItem
              text={ order.members.measurement ? order.members.measurement.getFullName() : '-' }
              subtext="Masuratorile au fost luate de"
            />

            <SimpleListItem
              text={ order.members.tailor ? order.members.tailor.getFullName() : '-' }
              subtext="Croitor"
            />

            <SimpleListItem
              text={ order.getDeadline('DD/MM/YYYY') }
              subtext="Data Finalizare Produs"
            />

            <SimpleListItem
              text={ order.getShippingMethodDetails() }
              subtext="Metoda livrare"
            />

            <SimpleListItem
              text={ order.getPaidDetails() }
              subtext="Status plata"
            />

            <SimpleListItem
              text={ order.getShippingDate('DD/MM/YYYY') }
              subtext="Data livrare"
            />

            <SimpleListItem
              text={ [Math.floor(orderTotalProcessingTime * 10) / 10, "minute"].join(" ") }
              subtext="Timp total prelucrare comanda"
            />

          </List>

          <View style={{flex:1, flexDirection: 'row', paddingVertical: 20 }}>

            { !order.parameters.complete && (
              <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Button circleButton icon="ios-resize" onPress={this.goToReview}></Button>
                <Text style={{fontSize:11, color: 'gray'}}>Adauga masuri</Text>
              </View>
            )}

            { !order.parameters.complete && !order.tailors.view && !order.parameters.return && (
              <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Button circleButton styleType="warning" icon="ios-cut" onPress={this.sendToTailors}></Button>
                <Text style={{fontSize:11, color: 'gray'}}>Trimite la croitori</Text>
              </View>
            )}

            { order.tailors.view && (
              <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Button circleButton styleType="danger" icon="ios-cut" onPress={this.hideFromTailors}></Button>
                <Text style={{fontSize:11, color: 'gray'}}>Ascunde croitorilor</Text>
              </View>
            )}

            { !order.parameters.complete && order.tailors.complete && order.parameters.measurements && (
              <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Button circleButton styleType="success" icon="ios-checkmark" onPress={this.markAsComplete}></Button>
                <Text style={{fontSize:11, color: 'gray'}}>
                  { order.shipping.takeout ? 'Ridicata din magazin' : 'Expediata' }
                </Text>
              </View>
            )}

            { order.parameters.complete && !order.parameters.return && (
              <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Button circleButton styleType="danger" icon="ios-close" onPress={this.markAsIncomplete}></Button>
                <Text style={{fontSize:11, color: 'gray'}}>Comanda gresita</Text>
              </View>
            )}

            { order.parameters.return && (
              <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                <Button circleButton styleType="success" icon="ios-checkmark" onPress={this.receivedProducts}></Button>
                <Text style={{fontSize:11, color: 'gray'}}>Produse primite</Text>
              </View>
            )}

          </View>

          <View style={{paddingLeft: 10, flex:1}}>

            <Timeline
              data={orderTimeline}
              circleSize={15}
              circleColor='rgb(45,156,219)'
              lineColor='gray'
              lineWidth={2}
              innerCircle={'dot'}
              timeContainerStyle={{minWidth:60, marginTop: -5 }}
              titleStyle={{ marginTop: -10, fontSize: 13 }}
              timeStyle={{ backgroundColor:Theme.PRIMARY, padding:5, paddingVertical: 8, borderRadius: 10 }}
              timeTextStyle={{color:'#fff', fontSize: 13}}
              descriptionStyle={{color:'gray', marginBottom: 30, fontSize: 12}}
              separatorStyle={{backgroundColor:'red',height: 3}}
              renderTime={this.renderTime}
              options={{
                style:{ paddingTop:10 },
                removeClippedSubviews: false
              }}
            />

          </View>

        </ScrollView>

        )}

      </Screen>
    )

  }
}

export default connect()(OrderDetails)

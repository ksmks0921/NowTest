/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { connect } from 'react-redux';
import moment from 'moment'

import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print';

import { StyleSheet, Text, View, FlatList, ScrollView, Platform } from 'react-native';
import { Badge } from 'react-native-elements';
import { hideLoading, showLoading } from '../../ui/redux/uiActions';

import Timeline from 'react-native-timeline-listview'
import Screen from '../../ui/components/Screen';
import * as Theme from '../../theme';

import Button from '../../ui/components/Button';
import Icon from '../../ui/components/Icon';
import List from '../../ui/components/list/List';
import ListHeader from '../../ui/components/list/ListHeader';
import SimpleListItem from '../../ui/components/list/SimpleListItem';
import InvisiblePickerField from '../../ui/components/form/InvisiblePickerField';

import { Utils } from '../../util/utils'
import { User } from '../../util/user'
import { Order, OrderLogTypes } from '../../util/order'
import { Customer } from '../../util/customer'
import { Staff } from '../../util/staff'

const styles = StyleSheet.create({

});

class OrderDetails extends React.Component<*> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Detalii comanda',
  };

  tailorField: InvisiblePickerField | null;

  constructor(props: Props, context: any) {

    super(props, context);

    this.state = {
      user: global.user,
      order: null,
      orderTimeline: [],
      customers: []
    };

  }

  async componentWillMount(){

    this.props.dispatch(showLoading());

  }

  async componentDidMount(){

    var orderId = this.props.navigation.getParam('orderId', null);

    let tailors = await Staff.findAllTailors()

    this.setState({ orderId, tailors }, () => {

      this.reloadOrder()

    })

  }

  reloadOrder = async () => {

    let order = await Order.findOne(this.state.orderId)

    var orderReviews = await Order.getReviews(order)
    orderReviews =  Utils.sortByField(orderReviews, 'createdAt', true)

    let orderLastReview = orderReviews.length ? orderReviews[0] : null

    var orderReviewContent, orderReviewContentHtml = ''

    if(orderLastReview){
      orderReviewContent = await Order.getReviewContent(orderLastReview)
      orderReviewContentHtml = await Order.getReviewContent(orderLastReview, '</br>')
    }

    let orderStatus = Order.getStatus(order)

    this.setState({ order, orderLastReview, orderReviewContent, orderReviewContentHtml, orderStatus })

    this.props.dispatch(hideLoading())

  }

  setTimer = async (mode) => {
    this.props.dispatch(showLoading())
    await Order.setTimer(this.state.order, mode)
    this.reloadOrder()
  }

  completeOrder = async () => {
    this.props.dispatch(showLoading())
    await Order.setTailorsComplete(this.state.order, true)
    this.reloadOrder()
  }

  startWork = () => {
    this.setTimer(true)
  }

  stopWork = () => {
    this.setTimer(false)
  }

  createPDF = async () => {

    let options = {
      html: this.renderHtml(),
      fileName: 'order-' + this.state.order._id,
      //directory: 'docs',
      base64: true,
    };

    let file = await RNHTMLtoPDF.convert(options)

    return file.filePath;
  }

  printOrder = async () => {

    var orderPdf = await this.createPDF()

    await RNPrint.print({ filePath: orderPdf })

    await Order.addLog(this.state.order, OrderLogTypes.TAILORS_PRINT, Staff.getModelKey(this.state.order.members.tailor))

  }

  addTailor = () => {
    this.tailorField.show()
  }

  tailorSelected = async (value) => {

    let foundTailor = await Staff.findOne(value)

    if(foundTailor){

      this.props.dispatch(showLoading())

      await Order.setTailor(this.state.order, value)

      this.reloadOrder()
    }
  }

  renderHtml() {

    const { order, orderLastReview, orderReviewContentHtml, orderStatus, tailors } = this.state

    return '\
      <div style="font-family:Helvetica">\
        <p style="margin:0; padding:0;">Nume client</p>\
        <h3 style="margin:0;">' + order.customer.getFullName() + '</h3><br>\
        <p style="margin:0; padding:0;">Telefon</p>\
        <h3 style="margin:0;">' + order.shipping.phone + '</h3><br>\
        <p style="margin:0; padding:0;">Adresa</p>\
        <h3 style="margin:0;">' + order.shipping.address + '</h3><br>\
        <p style="margin:0; padding:0;">Consilier</p>\
        <h3 style="margin:0;">' + order.members.guidance.getFullName() + '</h3><br>\
        <p style="margin:0; padding:0;">Masuratorile au fost luate de</p>\
        <h3 style="margin:0;">' + order.members.measurement.getFullName() + '</h3><br>\
        <p style="margin:0; padding:0;">Croitor</p>\
        <h3 style="margin:0;">' + (order.members.tailor ? order.members.tailor.getFullName() : 'Niciun croitor asignat')  + '</h3><br>\
        <p style="margin:0; padding:0;">Data Finalizare</p>\
        <h3 style="margin:0;">' + ('Comanda trebuie finalizata in ' + order.getDeadlineDays() + ' zile <br>Data exacta: ' + order.getDeadline('DD/MM/YYYY')) + '</h3><br>\
        <p style="margin:0; padding:0;">Metoda livrare</p>\
        <h3 style="margin:0;">' + order.getShippingMethodDetails() + '</h3><br>\
        <p style="margin:0; padding:0;">Status plata</p>\
        <h3 style="margin:0;">' + order.getPaidDetails() + '</h3><br>\
        <p style="margin:0; padding:0;">Data livrare</p>\
        <h3 style="margin:0;">' + order.getShippingDate('DD/MM/YYYY') + '</h3><br>\
        <p style="margin:0; padding:0;">Detalii comanda</p>\
        <p style="margin:0;font-weight: bold;">' + ( orderLastReview ? orderReviewContentHtml : 'Masuratorile nu au fost adaugate inca')  + '</p>\
      </div>';
  }

  render() {

    const { order, orderLastReview, orderReviewContent, orderStatus, tailors } = this.state

    var tailorsList = tailors ? tailors.map((tailorsItem, index) => {
      return {
        key: tailorsItem._id,
        label: tailorsItem.getFullName()
      }
    }) : []

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

          { !order.tailors.complete && (
            <View style={{flex:1, flexDirection: 'row', paddingVertical: 20 }}>

              { !order.members.tailor && (
                <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Button circleButton icon="ios-cut" onPress={this.addTailor}></Button>
                  <Text style={{fontSize:11, color: 'gray'}}>Atribuie croitor</Text>
                </View>
              )}

              { order.members.tailor && !order.tailors.timer && (
                <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Button circleButton styleType="primary" icon="ios-cut" onPress={this.startWork}></Button>
                  <Text style={{fontSize:11, color: 'gray'}}>Incepe lucru</Text>
                </View>
              )}

              { order.tailors.timer && (
                <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Button circleButton styleType="danger" icon="ios-stopwatch" onPress={this.stopWork}></Button>
                  <Text style={{fontSize:11, color: 'gray'}}>Stop lucru</Text>
                </View>
              )}

              { order.members.tailor && !order.tailors.timer && order.tailors.processed && (
                <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Button circleButton styleType="success" icon="ios-checkmark" onPress={this.completeOrder}></Button>
                  <Text style={{fontSize:11, color: 'gray'}}>Finalizare comanda</Text>
                </View>
              )}

              { order.members.tailor && !order.tailors.timer && (
                <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <Button circleButton styleType="danger" icon="ios-print" onPress={this.printOrder}></Button>
                  <Text style={{fontSize:11, color: 'gray'}}>Print</Text>
                </View>
              )}
            </View>
          )}

          <List>

            <SimpleListItem
              text={ order.customer.getFullName() }
              subtext="Nume client"
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

          </List>

          <InvisiblePickerField
            objects={tailorsList}
            ref={(ref) => { this.tailorField = ref; }}
            onChange={this.tailorSelected}
          />

        </ScrollView>

        )}

      </Screen>
    );

  }
}

export default connect()(OrderDetails);

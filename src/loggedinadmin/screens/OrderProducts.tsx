/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { Component } from 'react'

import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import { Badge } from 'react-native-elements'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'

import Timeline from 'react-native-timeline-listview'
import Screen from '../../ui/components/Screen'
import * as Theme from '../../theme'

import Button from '../../ui/components/Button'
import SubmitButton from '../../ui/components/form/SubmitButton'
import List from '../../ui/components/list/List'
import ListHeader from '../../ui/components/list/ListHeader'
import SimpleListItem from '../../ui/components/list/SimpleListItem'
import ProductListItem from '../../ui/components/form/ProductListItem'

import { User } from '../../util/user'
import { Order } from '../../util/order'
import { Customer } from '../../util/customer'
import { Staff } from '../../util/staff'
import { Product } from '../../util/product'


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
  userData: Object,
  order: Object,
  orderTimeline: Array,
  customers: Array
}

const styles = StyleSheet.create({

})

class OrderProducts extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Algere produsele',
  }

  constructor(props: Props, context: any) {

    super(props, context)

    this.state = {
      user: global.user,
      userData: global.userData,
      order: null,
      orderTimeline: [],
      customers: []
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

  reloadOrder = async () => {

    let order = await Order.findOne(this.state.orderId)

    let products = await Product.findAll()

    this.setState({ order, products })

    this.props.dispatch(hideLoading())

  }

  onSubmit = async (values) => {

    this.props.dispatch(showLoading())

    var orderProducts = []

    for(var productId in values){

      var productQuantity = values[productId]

      if(!productQuantity) continue

      for(var productIndex = 0; productIndex < productQuantity; productIndex++){

        orderProducts.push({
          product: productId,
          measurements: [],
          sku: null
        })

      }

    }

    if(orderProducts.length){

      await Order.addReview(this.state.order, orderProducts)

      this.props.dispatch(hideLoading())

      this.props.navigation.navigate('OrderReview', {
        orderId: this.state.order._id
      })

    }

  }

  render() {

    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props

    const { order, products } = this.state

    return (
      <Screen style={{paddingTop: 50}}>

        { order && products.length && (

        <ScrollView>

          <List containerStyle={{marginTop:0}}>

            { products.map(product => {
              return (
                <Field
                  key={product._id}
                  name={product._id}
                  component={ProductListItem}
                  onChange={this.storeQuatity}
                  product={product}
                />
              )
            })}

          </List>

          <SubmitButton
            disabled={invalid && !error}
            loading={submitting}
            onPress={handleSubmit(this.onSubmit)}
            containerStyle={{marginTop: 30}}
            text="Pasul urmator"
          />

        </ScrollView>

        )}

      </Screen>
    )

  }
}

// connect allows the component to communicate with redux
export default withNavigation(reduxForm({
  form: 'OrderProducts',
})(OrderProducts))

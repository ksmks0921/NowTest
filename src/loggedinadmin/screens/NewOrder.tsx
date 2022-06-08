/**
 * @flow
 *
 * The NewOrder screen allows the user to view and manage all their linked accounts.
 */
import React from 'react'
import { Component } from 'react'
import { AlertIOS, ListView, StyleSheet, ScrollView, View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { NavigationScreenProp } from 'react-navigation/src/TypeDefinition'
import * as Theme from '../../theme'
import moment from 'moment'

import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import FormError from '../../ui/components/form/FormError'

import Screen from '../../ui/components/Screen'
import SubmitButton from '../../ui/components/form/SubmitButton'
import DateTimePickerField from '../../ui/components/form/DateTimePickerField'
import SwitchField from '../../ui/components/form/SwitchField'
import ObjectsPickerField from '../../ui/components/form/ObjectsPickerField'
import Button from '../../ui/components/Button'
import TextField from '../../ui/components/form/TextField'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'
import { showError, showMessage, showWarning } from '../../ui/components/Toast'

import { isNameValid, isEmailValid, isPhoneNumberValid, isPasswordValid } from '../../util/validator'

import { Customer } from '../../util/customer'
import { Staff } from '../../util/staff'
import { Order } from '../../util/order'

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
  customers: Array,
  staff: Array
}

const styles = StyleSheet.create({

})

class NewOrder extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Comanda noua',
  }

  static defaultProps = {

  }

  constructor(props: Props, context: any) {

    super(props, context)

    // Set the default state of the component
    this.state = {
      customers: [],
      addedCustomer: null,
      staff: [],
      paidAdvance: false
    }

  }

  componentWillMount() {

    this.props.dispatch(showLoading())

  }

  componentDidMount() {

    this.loadData()

  }

  onCustomersChanged = async () => {
    let customers = await Customer.findAll(true)
    this.setState({ customers })
  }

  loadData = async () => {

     try {

      this.onCustomersChanged()

      let staff = await Staff.findAllCustomerCare()

      this.setState({ staff })

    } catch (error) {

    }

    this.props.dispatch(hideLoading())

  }

  onCustomerAdded(customerData){

    this.setState({
      addedCustomer: customerData._id
    })

    this.onCustomersChanged()

  }

  navigateToAddCustomer = () => {

    this.props.navigation.navigate('NewCustomer', {
      callback: this.onCustomerAdded.bind(this)
    })

  }

  onSubmit = async(valuesObj) => {

    var values = Object.assign({}, valuesObj)

    this.props.dispatch(showLoading())

    try {

      var orderData = {
        customer: values.customer,
        parameters: {
          paid: values.paid,
          advanceamount: values.paidAdvance ? values.paidAmount : null
        },
        shipping: {
          address: values.address,
          phone: values.phone,
          takeout: values.takeout,
          delivery: values.delivery,
          date: moment(values.deliveryDate, 'DD/MM/YYYY')
        },
        members: {
          measurement: values.measurementPerson,
          guidance: values.guidancePerson
        },
        tailors: {
          deadline: moment(values.deadlineDate, 'DD/MM/YYYY')
        }
      }

      let newOrder = await Order.new(orderData)

      showMessage('Your order was saved!')

      this.props.dispatch(hideLoading())

      this.props.reset()

      this.props.navigation.navigate('OrderProducts', {
        orderId: newOrder._id
      })

    } catch (error) {
      showError(error)
    }

  }

  customerSelected = async(value) => {
      if(value){
        let foundCustomer = await Customer.findOne(value)
        if (foundCustomer) {
          this.props.change('phone', foundCustomer.phone)
          this.props.change('address', foundCustomer.address)
        }
    }
  }

  render() {

    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props

    const {
      customers,
      staff,
      addedCustomer,
      paidAdvance
    } = this.state

    var customersList = customers.map((customer) => {
      let customerName = [customer.firstName || null, customer.lastName || null].filter(item => !!item).join(' ')
      return {
        key: customer._id,
        label: customerName
      }
    })

    var staffList = staff.map((staffItem, index) => {
      return {
        key: staffItem._id,
        label: [staffItem.firstName || null, staffItem.lastName || null].filter(item => !!item).join(' ')
      }
    })

    return (
      <Screen>

        <FormError error={error} />

        <KeyboardAwareScrollView>

          <Field
            component={ObjectsPickerField}
            keyboardType="default"
            name="guidancePerson"
            placeholder="Client consiliat de catre"
            validate={isNameValid}
            objects={staffList}
            icon="md-person"
          />

          <Field
            component={ObjectsPickerField}
            keyboardType="default"
            name="measurementPerson"
            placeholder="Masuratori luate de catre"
            validate={isNameValid}
            objects={staffList}
            icon="md-person"
          />

          <View style={{ height: 70 }}>

            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>

              <View style={{ width: '60%' }}>
                <Field
                  component={ObjectsPickerField}
                  keyboardType="default"
                  name="customer"
                  placeholder="Client existent"
                  validate={isNameValid}
                  objects={customersList}
                  icon="md-person"
                  defaultPicked={addedCustomer}
                  onChange={this.customerSelected}
                />
              </View>

              <View style={{ width: '40%' }}>
                <Button text="Client nou" onPress={this.navigateToAddCustomer} containerStyle={{ backgroundColor: Theme.PRIMARY }} />
              </View>

            </View>

          </View>

          <Field
            component={TextField}
            keyboardType="phone-pad"
            name="phone"
            placeholder="Telefon"
            validate={isPhoneNumberValid}
          />

          <Field
            component={TextField}
            keyboardType="default"
            name="address"
            placeholder="Adresa"
          />

          <Field
            component={DateTimePickerField}
            name="deadlineDate"
            placeholder="Data finalizare produs - croitori"
          />

          <Field
            component={DateTimePickerField}
            name="deliveryDate"
            placeholder="Data livrare sau ridicare produs"
          />

          <Field
            component={SwitchField}
            name="delivery"
            placeholder="Expediat"
          />

          <Field
            component={SwitchField}
            name="takeout"
            placeholder="Ridicare din magazin"
          />

          <Field
            component={SwitchField}
            name="paid"
            placeholder="Achitata"
          />

          <Field
            component={SwitchField}
            name="paidAdvance"
            placeholder="Avans"
            onChange={(value) => { this.setState({ paidAdvance : value }) }}
          />

          { paidAdvance && (<Field
            component={TextField}
            keyboardType="numeric"
            name="paidAmount"
            placeholder="Suma achitata"
          />) }

           <SubmitButton
            ldisabled={invalid && !error}
            loading={submitting}
            onPress={handleSubmit(this.onSubmit)}
            text="Adaugare comanda"
          />

        </KeyboardAwareScrollView>

      </Screen>

    )
  }
}

// connect allows the component to communicate with redux
export default withNavigation(reduxForm({
  form: 'NewOrder',
})(NewOrder))

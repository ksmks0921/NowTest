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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { StyleSheet, Text, View, ScrollView, Image, FlatList } from 'react-native'
import { List, ListItem, Badge } from 'react-native-elements'

import { hideLoading, showLoading } from '../../ui/redux/uiActions'
import { showError, showMessage, showWarning } from '../../ui/components/Toast'

import FormError from '../../ui/components/form/FormError'
import * as Theme from '../../theme'

import Screen from '../../ui/components/Screen'
import SubmitButton from '../../ui/components/form/SubmitButton'
import TextField from '../../ui/components/form/TextField'
import Button from '../../ui/components/Button'
import Icon from '../../ui/components/Icon'
import CollapsibleItem from '../../ui/components/list/CollapsibleItem'
import HeaderButton from '../../ui/components/HeaderButton'
import MeasurementsAutocomplete from '../../ui/components/MeasurementsAutocomplete'

import { User } from '../../util/user'
import { Order } from '../../util/order'
import { Product, ProductSectionFieldTypes } from '../../util/product'

import { Utils } from '../../util/utils'

const styles = StyleSheet.create({
  sectionsContainer: {
    padding: 0
  },
  sectionHeader: {
    padding: 10,
    paddingVertical: 5,
    marginBottom: 15
  },
  sectionHeaderIcon: {
    color: Theme.PRIMARY,
    fontWeight: 'bold',
    fontSize: 30,
    padding: 0
  },
  productDescription: {
    marginBottom: 0,
    borderColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 20
  },
  sectionHeaderText: {
    color: '#000',
    fontWeight:'bold'
  },
  productDescriptionText: {
    fontSize: 17
  },
  sectionContent: {
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 15
  },
  sectionContentActive: {
    marginBottom: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  inputFieldContainer: {
    backgroundColor: '#fff'
  },
  inputField: {
    width: '100%',
    height: 35,
    fontSize: 14,
    lineHeight: 17,
    padding:0,
  },
  image: {
    height: 80,
    width: 70,
  }
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
  userData: Object,
  order: Object,
  orderProducts: Array,
  sectionsStatus: Object
}

var measurementAutocompleteElement:any = null

class OrderReview extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Masuratori',
    headerRight: <HeaderButton text="Importare" onPress={() => { measurementAutocompleteElement.setModalVisible(true); }} />
  }

  constructor(props: Props, context: any) {

    super(props, context)

    this.state = {
      user: global.user,
      order: null,
      orderProducts: [],
      sectionsStatus: {}
    }

  }

  async componentWillMount(){

    this.props.dispatch(showLoading())

  }

  loadMeasurements(importMeasurements:any[]){

    var sectionsStatus:any = {}
    var formDefaultValues:any = {}

    if(!this.state.order || !this.state.orderProducts.length){
      return
    }

    for(var orderProduct of this.state.orderProducts){

        const orderProductId = orderProduct._id
        const product = orderProduct.product

        sectionsStatus[orderProductId] = {}

        for(var section of product.sections){

            var sectionId = section._id

            if(!section) continue

            sectionsStatus[orderProductId][sectionId] = null

            for(var field of section.fields){

                let fieldKey = [orderProductId, field._id].join('__')

                var importedMeasurement = Utils.findFirst(importMeasurements, '_id', field._id)

                var importValue = '';

                if(importedMeasurement){
                    importValue = importedMeasurement.value
                }

                formDefaultValues[fieldKey] = importValue

                if(importValue) {
                    sectionsStatus[orderProductId][sectionId] = 'filled'
                }

            }
        }
    }

    this.props.initialize(formDefaultValues)

    this.setState({ sectionsStatus })

  }

  async componentDidMount(){

    measurementAutocompleteElement.setCallback(this.loadMeasurements, this)

    var orderId = this.props.navigation.getParam('orderId', null)

    let order = await Order.findOne(orderId)

    let products = await Product.findAll()

    let orderProducts = await Order.getProducts(order)

    for(var orderProduct of orderProducts){
      orderProduct.product = products.filter(item => item._id == orderProduct.product )[0]
    }

    this.setState({ order, orderProducts })

    this.setFormValues(order, orderProducts)

    this.props.dispatch(hideLoading())
  }

  setFormValues(order, orderProducts){

    var sectionsStatus = {}

    var formDefaultValues = {}

    if(!order || !orderProducts.length){
      return
    }

    for(var orderProduct of orderProducts){

      const orderProductId = orderProduct._id
      const product = orderProduct.product
      const measurements = orderProduct.measurements

      sectionsStatus[orderProductId] = {}

      if(orderProduct.sku){
        formDefaultValues[[orderProductId, 'sku'].join('__')] = orderProduct.sku
      }

      if(orderProduct.size){
        formDefaultValues[[orderProductId, 'size'].join('__')] = orderProduct.size
      }

      for(var section of product.sections){

        var sectionId = section._id

        sectionsStatus[orderProductId][sectionId] = null

        var section = Utils.findFirst(product.sections, '_id', sectionId)

        if(!measurements || !measurements.length || !section) continue

        for(var field of section.fields){

          let fieldKey = [orderProductId, field._id].join('__')

          var fieldValue = Utils.findFirst(measurements, 'field', field._id)

          if(!fieldValue) continue

          formDefaultValues[fieldKey] = fieldValue.value

          sectionsStatus[orderProductId][sectionId] = 'filled'

        }
      }

    }

    this.props.initialize(formDefaultValues)

    this.setState({ sectionsStatus })

  }

  getReviewValues(values){

    var { orderProducts } = this.state

    var reviewValues = {}

    // Get measurements, sku and size
    for(fieldKey in values){

      let splitedKey = fieldKey.split('__')

      if(splitedKey.length !== 2) continue

      var productId = splitedKey[0]
      var fieldId = splitedKey[1]

      if(!reviewValues[productId]){
        reviewValues[productId] = {}
      }

      if(!reviewValues[productId].measurements){
        reviewValues[productId].measurements = []
      }

      if(fieldId == 'sku'){
        reviewValues[productId].sku = values[fieldKey]
        continue
      }
      else if(fieldId == 'size'){
        reviewValues[productId].size = values[fieldKey]
        continue
      }

      reviewValues[productId].measurements.push({
        field: fieldId,
        value: values[fieldKey]
      })
    }

    var newProducts = []

    for(var orderProductId in reviewValues){

      var orderProduct = Utils.findFirst(orderProducts, '_id', orderProductId)

      if(!orderProduct) continue

      reviewValues[orderProductId].product = Product.getModelKey(orderProduct.product)

      newProducts.push(reviewValues[orderProductId])

    }

    return newProducts

  }

  isSectionFilled = (orderProduct, sectionId) => {

    var product = orderProduct.product

    var section = Utils.findFirst(product.sections || [], '_id', sectionId)

    if(section){

      for(field of section.fields){

        var measurement = Utils.findFirst(orderProduct.measurements || [], 'field', field._id)

        if(measurement && measurement.value){
          return true
        }

      }
    }

    return false

  }

  measurementChanged = async (orderProduct, sectionId, fieldId, value) => {

    var { sectionsStatus } = this.state

    let orderProductId = orderProduct._id

    var markAsChange = true
    var measurement = Utils.findFirst(orderProduct.measurements || [], 'field', fieldId)

    value = value.toString()

    if(measurement){

      var originalFieldValue = measurement.value.toString()

      if(originalFieldValue == value){
        markAsChange = false
      }
      else if(!originalFieldValue && !value){
        markAsChange = false
      }

    }
    else{
      if(!value){
        markAsChange = false
      }
    }

    if(markAsChange){

      sectionsStatus[orderProductId][sectionId] = "edited"

    }
    else{

        sectionsStatus[orderProductId][sectionId] = null

        if(this.isSectionFilled(orderProduct, sectionId)){
          sectionsStatus[orderProductId][sectionId] = 'filled'
        }

    }

    this.setState({ sectionsStatus })

  }

  onSubmit = async (valuesObj: Object) => {

    this.props.dispatch(showLoading())

    let values = Object.assign({}, valuesObj)

    const { orderProducts } = this.state

    try{

      let reviewValues = this.getReviewValues(values)

      let response = await Order.addReview(this.state.order, reviewValues)

      if(response.changed){
        showMessage('Comanda modificata. Masuratorile au fost salvate!')
      }
      else{
        showMessage('Nicio modificare efectuata. Produsele din comanda raman la starea pe care o aveau!')
      }

      this.props.dispatch(hideLoading())

      this.props.navigation.navigate('OrderDetails', {
        orderId: this.state.order._id
      })

    }
    catch(error){
      console.log(error)
    }

  }

  renderFieldsSection = (itemData) => {

    const { sectionsStatus } = this.state

    const { section, orderProduct } = itemData.item

    var sectionId = section._id
    var orderProductId = orderProduct._id

    var fields = section.fields

    const sectionStatus = sectionsStatus[orderProductId] ? sectionsStatus[orderProductId][sectionId] : null

    const isEdited = sectionStatus == "edited"
    const isFilled = sectionStatus == "filled"

    const deboubcedOnChange = Utils.debounce(this.measurementChanged, 500)

    return (
      <ListItem
        component={CollapsibleItem}
        item={{ title: section.title }}
        hideChevron
        icon={ isEdited ? "ios-create" : isFilled ? "ios-chatboxes" : "" }
        iconStyle={ isEdited ? "danger" : isFilled ? "success" : "" }
        content={

          fields.map((field, fieldIndex) => {

            var fieldKey = [orderProduct._id, field._id].join('__')

            return (
              <View style={{flex: 1}} key={fieldKey}>
                <Field
                  inputStyle={styles.inputField}
                  style={styles.inputFieldContainer}
                  component={TextField}
                  keyboardType={ field.type == ProductSectionFieldTypes.NUMBER ? 'decimal-pad' : 'default' }
                  name={fieldKey}
                  placeholder={field.name}
                  onChange={ (value) => {
                    deboubcedOnChange(orderProduct, sectionId, field._id, value)
                  }}
                />
              </View>
            )

          })

        }
      />
    )

  }

  render() {

    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props

    const {
      order,
      orderProducts
    } = this.state

    if(orderProducts){
      orderProducts.sort(function(a, b) {
        return a.product.order > b.product.order
      })
    }

    var productsTypeCounts = {}

    return (

      <Screen style={{paddingTop: 50}}>

        <MeasurementsAutocomplete
          order={order}
          ref={(ref) => { measurementAutocompleteElement = ref; }}
        />

        <FormError error={error} />

        <KeyboardAwareScrollView extraHeight={150}>

          { order && orderProducts.length && (

            <View style={styles.sectionsContainer}>

              {
                orderProducts.map((orderProduct, productIndex) => {

                  // Increment product type count
                  productsTypeCounts[orderProduct.product._id] ? productsTypeCounts[orderProduct.product._id]++ : productsTypeCounts[orderProduct.product._id] = 1

                  var sections = Utils.sortByField(orderProduct.product.sections, 'order').map(function(section) {

                    return {
                      section: section,
                      orderProduct: orderProduct
                    }

                  })

                  return (

                    <View key={orderProduct._id}>

                      <View style={[ styles.sectionHeader, styles.productDescription ]}>

                        <View style={{flex:1, flexDirection:'row', alignItems: 'center' }}>

                          <View style={{width: '20%'}}>
                            <Image resizeMode="contain" source={orderProduct.product.image} style={styles.image} />
                          </View>

                          <View style={{width: '30%'}}>
                            <Text style={[styles.sectionHeaderText, styles.productDescriptionText]}>
                              { orderProduct.product.name + ' ' + productsTypeCounts[orderProduct.product._id] }
                            </Text>
                          </View>

                          <View style={{width: '25%'}}>
                            <Field
                              inputStyle={styles.inputField}
                              component={TextField}
                              name={ [orderProduct._id, 'size'].join('__') }
                              placeholder="Marime"
                            />
                          </View>

                          <View style={{width: '25%'}}>
                            <Field
                              inputStyle={styles.inputField}
                              component={TextField}
                              name={ [orderProduct._id, 'sku'].join('__') }
                              placeholder="Cod"
                            />
                          </View>

                        </View>

                      </View>

                      <View style={[ styles.sectionContent, styles.sectionContentActive, styles.productFieldsContainer ]}>

                        <List containerStyle={{marginTop:0, borderTopWidth: 0}}>

                          <FlatList
                            data={sections}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderFieldsSection}
                          />

                        </List>

                      </View>

                    </View>

                  )

                })

              }

              <SubmitButton
                disabled={invalid && !error}
                loading={submitting}
                onPress={handleSubmit(this.onSubmit)}
                text="Salvare"
              />

            </View>

          )}

        </KeyboardAwareScrollView>

      </Screen>
    )

  }
}

// connect allows the component to communicate with redux
export default withNavigation(reduxForm({
  form: 'OrderReview',
})(OrderReview))

/**
 * @flow
 *
 * The NewCustomer screen allows the user to view and manage all their linked accounts.
 */
import React from 'react'
import { Component } from 'react'
import { AlertIOS, View, CheckBox, ScrollView, ListView, Image, StyleSheet, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { NavigationScreenProp } from 'react-navigation/src/TypeDefinition'
import * as Theme from '../../theme'

import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import FormError from '../../ui/components/form/FormError'

import Button from '../../ui/components/Button'
import Screen from '../../ui/components/Screen'
import TextField from '../../ui/components/form/TextField'
import SubmitButton from '../../ui/components/form/SubmitButton'
import SwitchField from '../../ui/components/form/SwitchField'

import { hideLoading, showLoading } from '../../ui/redux/uiActions'
import { showError, showMessage, showWarning } from '../../ui/components/Toast'
import { isNameValid, isEmailValid, isPhoneNumberValid, isPasswordValid } from '../../util/validator'

import { User } from '../../util/user'
import { Customer } from '../../util/customer'

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  dispatch: (Object) => any,
  navigation: NavigationScreenProp
} & FormProps

/*
 * We use flow type to validate the State of the component
 */
type State = {
  user: Object
}

const styles = StyleSheet.create({

})

class NewCustomer extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Client nou',
  }

  customerInput?: Field

  static defaultProps = {
    autoFocus: false
  }

  constructor(props: Props, context: any) {

    super(props, context)

    // Set the default state of the component
    this.state = {
      user: global.user,
    }

  }

  onSubmit = async (valuesObj: Object) => {

    var values = Object.assign({}, valuesObj)

    if(values.height){
        if(isNaN(parseInt(values.height))){
            alert('Inaltimea introdusa este incorecta');
            return;
        }
        if(parseInt(values.height) < 10){
            alert('Va rugam sa introduceti inaltimea in centimetrii. Exemplu ok: 150, Exemplu gresit 1.50');
            return;
        }
    }

    try{

      let newCustomerData = await Customer.new(values)

      showMessage('Clientul a fost adaugat!')

      if(this.props.navigation.state.params.callback){
        this.props.navigation.state.params.callback(newCustomerData)
      }

      this.props.reset()

      this.props.navigation.goBack()

    }
    catch(error){

      console.log('Customer save error: %s',  error)

      showError(error)

    }
  }

  render() {

    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props

    const { user, userData } = this.state

    return (
      <Screen>

        <FormError error={error} />

        <KeyboardAwareScrollView>

          <Field
            component={TextField}
            keyboardType="default"
            icon="md-person"
            name="lastName"
            placeholder="Nume"
            validate={isNameValid}
          />

          <Field
            component={TextField}
            keyboardType="default"
            icon="md-person"
            name="firstName"
            placeholder="Prenume"
            validate={isNameValid}
          />

          <Field
            autoCapitalize="none"
            component={TextField}
            keyboardType="default"
            icon="md-mail"
            name="email"
            placeholder="Email"
            validate={isEmailValid}
          />

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

          <View style={{
            height: 50,
            padding: 0,
            marginTop: 7,
            marginBottom: 7,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>

            <View style={{ width: '50%' }}>
              <Field
                component={TextField}
                keyboardType="numeric"
                name="age"
                placeholder="Varsta"
              />
            </View>
            <View style={{ width: '50%' }}>

              <View style={{
                height: 50,
                padding: 15,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>

                <View style={{ width: '50%' }}>
                  <Text>Casatorit?</Text>
                </View>

                <View style={{ width: '50%' }}>

                  <Field
                    component={SwitchField}
                    name="married"
                    seamless={true}
                  />

                </View>

              </View>

            </View>
          </View>

          <View style={{
            height: 50,
            padding: 0,
            marginTop: 7,
            marginBottom: 7,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>

          <View style={{ width: '50%' }}>
            <Field
                component={TextField}
                keyboardType="numeric"
                name="height"
                placeholder="Inaltime"
              />
            </View>
            <View style={{ width: '50%' }}>
              <Field
                component={TextField}
                keyboardType="numeric"
                name="weight"
                placeholder="Greutate"
              />
            </View>
          </View>

          <Field
            component={TextField}
            keyboardType="default"
            name="profession"
            placeholder="Profesie"
          />

          <Field
            component={TextField}
            keyboardType="default"
            name="salaryLevel"
            placeholder="De ce ne-ati ales pe noi?"
          />

          <Field
            component={TextField}
            keyboardType="default"
            name="brands"
            placeholder="Alte branduri pe care le imbraca"
          />

          <Field
            component={TextField}
            keyboardType="default"
            name="fashion"
            placeholder="Stilul fashion"
          />

          <SubmitButton
            ldisabled={invalid && !error}
            loading={submitting}
            onPress={handleSubmit(this.onSubmit)}
            text="Salvare client"
          />

        </KeyboardAwareScrollView>

      </Screen>
    )
  }
}

// connect allows the component to communicate with redux
export default withNavigation(reduxForm({
  form: 'NewCustomer',
})(NewCustomer))

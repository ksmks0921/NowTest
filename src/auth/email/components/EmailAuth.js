/**
 * @flow
 *
 * The EmailAuth component handles the email authentication flows for four cases:
 *
 * 1) Login
 * 2) Registration
 * 3) Linking
 * 4) Re-authentication
 *
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import { withNavigation } from 'react-navigation';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import type { FormProps } from 'redux-form';

import { showError, showMessage, showWarning } from '../../../ui/components/Toast'
import { hideLoading, showLoading } from '../../../ui/redux/uiActions'

import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';

import FormError from '../../../ui/components/form/FormError';
import LinkButton from '../../../ui/components/LinkButton';
import SubmitButton from '../../../ui/components/form/SubmitButton';
import TextField from '../../../ui/components/form/TextField';
import { isEmailValid, isNameValid, isPasswordValid } from '../../../util/validator';

import { User } from '../../../util/user'
import { AuthService } from '../../../util/authservice'
/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether to autofocus the first field
  autoFocus?: boolean,
  // The text to show on the submit button
  buttonText: string,
  // Whether to show a name field (for registration)
  collectName?: boolean,
  navigation: NavigationScreenProp<*, *>,
  // An optional function called when the auth flow has succeeded
  onSuccess?: (Object, ?string) => any,
  // The type of email authentication to perform
  type: 'link' | 'reAuth' | 'register' | 'signIn',
} & FormProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  forgottenPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    marginRight: 8,
  },
  forgottenPasswordText: {
    color: '#444',
    fontSize: 13,
  },
});

class EmailAuth extends React.Component<Props> {

  emailInput: ?Field;
  passwordInput: ?Field;

  static defaultProps = {
    autoFocus: false,
    collectName: false,
  }

  componentWillMount() {
    const { type } = this.props;
  }

  render() {

    const {
      autoFocus,
      buttonText,
      collectName,
      error,
      handleSubmit,
      invalid,
      submitting,
      type,
    } = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <FormError error={error} />
        {collectName && (
          <View>
            <Field
              autoFocus={autoFocus}
              component={TextField}
              icon="md-person"
              name="firstName"
              placeholder="Prenume"
              validate={isNameValid}
            />
            <Field
              autoFocus={autoFocus}
              component={TextField}
              icon="md-person"
              name="lastName"
              onSubmitEditing={this.focusEmailInput}
              placeholder="Nume de familie"
              validate={isNameValid}
            />
          </View>
        )}
        <Field
          autoCapitalize="none"
          autoFocus={autoFocus && !collectName}
          component={TextField}
          editable={type !== 'reAuth'}
          keyboardType="email-address"
          icon="md-mail"
          name="email"
          onSubmitEditing={this.focusPasswordInput}
          placeholder="Adresa de email"
          ref={(ref) => { this.emailInput = ref; }}
          validate={isEmailValid}
          withRef
        />
        <Field
          autoCapitalize="none"
          component={TextField}
          icon="md-lock"
          name="password"
          onSubmitEditing={handleSubmit(this.onSubmit)}
          placeholder="Parola"
          ref={(ref) => { this.passwordInput = ref; }}
          secureTextEntry
          validate={isPasswordValid}
          withRef
        />
        <SubmitButton
          disabled={invalid && !error}
          loading={submitting}
          onPress={handleSubmit(this.onSubmit)}
          text={buttonText}
        />
      </ScrollView>
    );
  }

  focusEmailInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.emailInput) this.emailInput.getRenderedComponent().focus();
  }

  focusPasswordInput = () => {
    // Redux Form exposes a `getRenderedComponent()` method to get the inner TextField
    if (this.passwordInput) this.passwordInput.getRenderedComponent().focus();
  }

  onForgottenPassword = () => {
    // Navigates to the Forgotten Password screen
    this.props.navigation.navigate('ForgottenPassword');
  }

  onSubmit = async (values: Object) => {
    const { email, firstName, lastName, password } = values;
    const { navigation, onSuccess, type } = this.props;

    this.props.dispatch(showLoading())

    try {

      var userCredential;
      var user;

      if (type === 'register') {

      }
      else {
        user = await AuthService.login(email, password)
      }

      if (onSuccess && user){
        this.props.dispatch(hideLoading())
        onSuccess(user)
      }

    } catch (error) {

      this.props.dispatch(hideLoading())

      showError(error.message)

    }

  }
}

// withNavigation ensures that the component has access to the navigation object
// reduxForm allows `redux-form` to manage the underlying form and its fields
export default withNavigation(reduxForm({
  form: 'EmailAuth',
})(EmailAuth));

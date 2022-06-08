/**
 * @flow
 *
 * The EmailSignUp component allows the user to sign up with an email address.
 */
import React from 'react'

import EmailAuth from './EmailAuth';

/**
 * Called when the user has successfully signed up.
 */
const onSuccess = (user: Object, name?: string, userData?:Object) => {

};

// We make use of the standard EmailAuth component to manage the flow
export default () => (
  <EmailAuth
    buttonText="Inregistrare"
    collectName
    onSuccess={onSuccess}
    type="register"
  />
);

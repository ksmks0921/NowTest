/**
 * @flow
 *
 * The EmailLogin component allows the user to login with an email address.
 */
import React from 'react'

import EmailAuth from './EmailAuth';

/**
 * Called when the user has successfully logged in.
 */
const onSuccess = (user) => {


};

// We make use of the standard EmailAuth component to manage the flow
export default () => (
  <EmailAuth
    buttonText="Autentificare"
    onSuccess={onSuccess}
    showForgottenPassword
    type="signIn"
  />
);

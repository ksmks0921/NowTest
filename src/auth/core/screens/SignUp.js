/**
 * @flow
 *
 * The SignUp screen allows the user to sign up.  It is made up of two tabs:
 *
 * 1) Email Sign Up
 * 2) Phone Sign Up
 *
 * And a third block handling Social Sign Up.
 */
import React from 'react';

import EmailSignUp from '../../email/components/EmailSignUp';
import Screen from '../../../ui/components/Screen';
import Tabs from '../../../ui/components/tab/Tabs';
import Tab from '../../../ui/components/tab/Tab';

/*
 * We use flow type to validate the State of the component
 */
type State = {

}

export default class SignUp extends React.Component<*, State> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Inregistrare',
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <Screen>

        <EmailSignUp />

      </Screen>
    );
  }
}

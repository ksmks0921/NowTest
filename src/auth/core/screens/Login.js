/**
 * @flow
 *
 * The Login screen allows the user to login.  It is made up of two tabs:
 *
 * 1) Email Login
 * 2) Phone Login
 *
 * And a third block handling Social Login.
 */
import React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import EmailLogin from '../../email/components/EmailLogin';
import Screen from '../../../ui/components/Screen';
import Tabs from '../../../ui/components/tab/Tabs';
import Tab from '../../../ui/components/tab/Tab';

import RNFirebaseLogo from '../../../../assets/sizexLogo.png';

/*
 * We use flow type to validate the State of the component
 */
type State = {
}

const styles = StyleSheet.create({
  image: {
    height: 125,
    width: 250,
  },
  welcome: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  }
});

/**
 * The Login Screen is made up of two tabs:
 */

export default class Login extends React.Component<*, State> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Log in',
  };

  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <Screen>
        <View style={styles.welcome}>
          <Image source={RNFirebaseLogo} style={styles.image} />
          <EmailLogin style={styles.loginView}/>
        </View>

      </Screen>
    );
  }

}

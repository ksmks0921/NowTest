/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'

import { Image, StyleSheet, Text, View } from 'react-native';

import Screen from '../../ui/components/Screen';

import RNFirebaseLogo from '../../../assets/sizexLogo.png';

import { User } from '../../util/user'

import { Staff } from '../../util/staff'

const styles = StyleSheet.create({

});

export default class Home extends React.Component<*> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    headerTitle: 'Acasa',
  };

  constructor(props: Props, context: any) {

    super(props, context);

    this.state = {

    };
  }

  componentDidMount() {

    /*this.props.navigation.navigate('OrderDetails', {
      orderId: '-LL9n2CUHWIXA3AD4OgE'
    });*/

  }

  render() {
    return (
      <Screen>

      </Screen>
    );
  }
}

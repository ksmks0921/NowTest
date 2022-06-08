/**
 * @flow
 *
 * The Logged Out Home screen is a simple screen allowing the user to choose whether to login or
 * register.
 */
import React from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import type { NavigationScreenProp } from 'react-navigation/src/TypeDefinition';

import Button from '../../ui/components/Button';
import LinkButton from '../../ui/components/LinkButton';
import Screen from '../../ui/components/Screen';

import RNFirebaseLogo from '../../../assets/sizexLogo.png';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  navigation: NavigationScreenProp<*, *>,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 125,
    width: 250,
  },
  linkContainer: {
    alignSelf: 'center',
    height: 45,
  },
  loginOptions: {
    padding: 8,
    marginBottom: 30
  },
  welcome: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#919191',
    marginTop: 24,
    textAlign: 'center',
  },
  loader: {
    marginTop: 100
  }
});

export default class Home extends React.Component<Props> {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Screen>
        <View style={styles.welcome}>

          <Image source={RNFirebaseLogo} style={styles.image} />

          <ActivityIndicator size="large" style={styles.loader} />

          <Text style={styles.welcomeText}>Incarcare date</Text>

        </View>

      </Screen>
    );
  }

}

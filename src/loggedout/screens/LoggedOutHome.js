/**
 * @flow
 *
 * The Logged Out Home screen is a simple screen allowing the user to choose whether to login or
 * register.
 */
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
    fontSize: 20,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default class Home extends React.Component<Props> {
  // Set the navigation options for `react-navigation`
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Screen>
        <View style={styles.welcome}>
          <Image source={RNFirebaseLogo} style={styles.image} />
          <Text style={styles.welcomeText}>
             aplicatie de management al comenzilor custom
          </Text>
        </View>
        <View style={styles.loginOptions}>
          <Button
            onPress={this.onLogin}
            text="Autentificare"
          />
        </View>
      </Screen>
    );
  }

  /**
   * Called when the Login button is pressed
   */
  onLogin = () => {
    // Navigate to the Login screen
    this.props.navigation.navigate('Login');
  }

}

/**
 * @flow
 *
 * This file sets up our Logged In screens.
 *
 * We use `react-navigation` for all navigation as it is the current standard JS navigation library
 * for react-native
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigator, TabBarBottom, TabNavigator } from 'react-navigation';

import Icon from '../../ui/components/Icon';
import * as Theme from '../../theme';

import Profile from './Profile';
import Orders from './Orders';
import OrderDetails from './OrderDetails';

type TabBarIcon = {
  tintColor: string,
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
  },
});

/*
 * We use a StackNavigator for the Profile tab. This allows screens to stack on top of each
 * other and to navigate backwards and forwards between them.
 *
 * Find out more: https://reactnavigation.org/docs/navigators/stack
 */

 const ProfileStack = StackNavigator({
  Profile: { screen: Profile },
}, {
  // Explicitly set the default screen to use
  initialRouteName: 'Profile',
  navigationOptions: Theme.HEADER_OPTIONS
});

const OrdersStack = StackNavigator({
  Orders: {
    screen: Orders
  },
  OrderDetails: {
    screen: OrderDetails
  },
}, {
  // Explicitly set the default screen to use
  initialRouteName: 'Orders',
  navigationOptions: Theme.HEADER_OPTIONS
});

/*
 * We use a TabNavigator for the main logged in screens. Each tab consists of its own set
 * of screens.
 *
 * Find out more: https://reactnavigation.org/docs/navigators/tab
 */
const Tabs = TabNavigator({
  Orders: {
    navigationOptions: {
      tabBarIcon: ({ tintColor }: TabBarIcon) => <Icon name="ios-cart" style={[styles.icon, { color: tintColor }]} />,
      tabBarLabel: 'Comenzi',
    },
    screen: OrdersStack,
  },
  Profile: {
    navigationOptions: {
      tabBarIcon: ({ tintColor }: TabBarIcon) => <Icon name="ios-person" style={[styles.icon, { color: tintColor }]} />,
      tabBarLabel: 'Profil',
    },
    screen: ProfileStack,
  },

}, {
  initialRouteName: 'Orders',
  tabBarOptions: {
    activeTintColor: Theme.PRIMARY
  },
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
});

/*
 * We use a StackNavigator as the basis for the logged in screens. This allows us to present the
 * re-authentication screen over the top of any other screen.
 *
 * Find out more: https://reactnavigation.org/docs/navigators/stack
 */
export default StackNavigator({
  Tabs: { screen: Tabs },
}, {
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  headerMode: 'none',
  initialRouteName: 'Tabs',
  mode: 'modal',
});

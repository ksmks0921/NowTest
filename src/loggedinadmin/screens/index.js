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
import NewOrder from './NewOrder';
import NewCustomer from './NewCustomer';
import Orders from './Orders';
import OrderDetails from './OrderDetails';
import OrderProducts from './OrderProducts';
import OrderReview from './OrderReview';
import StaffDashboard from './StaffDashboard';
import ReportsDashboard from './ReportsDashboard';
import CustomerReport from './CustomerReport';

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

const NewOrderStack = StackNavigator({
  NewOrder: { screen: NewOrder },
  NewCustomer: { screen: NewCustomer },
}, {
  // Explicitly set the default screen to use
  initialRouteName: 'NewOrder',
  navigationOptions: Theme.HEADER_OPTIONS
});

const StaffStack = StackNavigator({
  Staff: { screen: StaffDashboard }
}, {
  // Explicitly set the default screen to use
  initialRouteName: 'Staff',
  navigationOptions: Theme.HEADER_OPTIONS
});

const ReportsStack = StackNavigator({
  Reports: { screen: ReportsDashboard },
  CustomerReport: { screen: CustomerReport }
}, {
  // Explicitly set the default screen to use
  initialRouteName: 'Reports',
  navigationOptions: Theme.HEADER_OPTIONS
});

const OrdersStack = StackNavigator({
  Orders: {
    screen: Orders
  },
  OrderDetails: {
    screen: OrderDetails
  },
  OrderReview: {
    screen: OrderReview
  },
  OrderProducts: {
    screen: OrderProducts
  }
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
  NewOrder: {
    navigationOptions: {
      tabBarIcon: ({ tintColor }: TabBarIcon) => <Icon name="ios-add-circle" style={[styles.icon, { color: tintColor }]} />,
      tabBarLabel: 'Comanda noua',
    },
    screen: NewOrderStack,
  },
  Staff: {
    navigationOptions: {
      tabBarIcon: ({ tintColor }: TabBarIcon) => <Icon name="ios-people" style={[styles.icon, { color: tintColor }]} />,
      tabBarLabel: 'Personal',
    },
    screen: StaffStack,
  },
  Reports: {
    navigationOptions: {
      tabBarIcon: ({ tintColor }: TabBarIcon) => <Icon name="ios-stats" style={[styles.icon, { color: tintColor }]} />,
      tabBarLabel: 'Rapoarte',
    },
    screen: ReportsStack,
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
    activeTintColor: Theme.PRIMARY,
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

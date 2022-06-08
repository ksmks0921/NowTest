/**
 * @flow
 *
 * This file sets up our Logged Out screens.
 *
 * We use `react-navigation` for all navigation as it is the current standard JS navigation library
 * for react-native
 */
import { StackNavigator } from 'react-navigation';

// Load all our logged out screens
import InitialLoading from './InitialLoading';


/*
 * We use a StackNavigator for the logged out screens. This allows screens to stack on top of each
 * other and to navigate backwards and forwards between them.
 *
 * Find out more: https://reactnavigation.org/docs/navigators/stack
 */
export default StackNavigator({
  Loading: { screen: InitialLoading },
}, {
  // Explicitly set the default screen to use
  initialRouteName: 'Loading',
});

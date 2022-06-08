/**
 * @flow
 *
 * This file is the main entry point into our app.
 * It is shared across both Android and iOS.
 */
import React from 'react'
import { StyleSheet, View, YellowBox } from 'react-native'

import { Provider } from 'react-redux'

import store from './redux/store'

import LoadingModal from './ui/components/LoadingModal'
import LoggedInAdmin from './loggedinadmin/screens'
import LoggedInTailor from './loggedintailor/screens'
import LoggedInCustomer from './loggedincustomer/screens'
import LoggedOut from './loggedout/screens'
import InitialLoading from './initialloading/screens'

import { showError, showMessage, showWarning } from './ui/components/Toast'
import { hideLoading, showLoading } from './ui/redux/uiActions'

import { AuthService } from './util/authservice'
import { User, UserRoles } from './util/user'
import { Staff } from './util/staff'
import { Customer } from './util/customer'
import { Product } from './util/product'

// TODO: This is here because of warnings in react-navigation:
YellowBox.ignoreWarnings([
  // https://github.com/react-navigation/react-navigation/issues/3956
  'Warning: isMounted(...) is deprecated',

  'Require cycle:',

  // https://github.com/facebook/react-native/issues/14806
  'Class RCTCxxxModule was not exported',
  'Class RCTCxxModule',
  // https://github.com/facebook/react-native/issues/17504
  'Module RCTImageLoader requires main queue setup',

  'Module RNPrint requires main queue setup since it overrides',

  'No user currently signed',

  'Error: No user currently signed',

  'Error: No user currently signed in.',

  'RCTBridge required dispatch_sync to load RCTAppState. This may lead to deadlocks',

  'Required dispatch_sync to load constants for RCTAppState. This may lead to deadlocks',

  'RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks'
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:0,
    margin:0
  },
});


interface Props {

}

interface State {
  enthusiasmLevel: number;
}

/*
 * We use flow type to validate the State of the component
 */
type State = {
  // Whether is still checking if the user is logged in or out
  loading: boolean,
  // The user
  user?: Object
}

export default class App extends React.Component<Props, State> {

  state: State;

  constructor() {
    super()

    this.state = {
      loading: true,
      user: null
    }

  }

  async componentDidMount() {

    showLoading()

    AuthService.on('change', async () => {

      this.reloadContent()

    })

    this.reloadContent()

  }

  reloadContent = async () => {

      var accessToken = null

      AuthService.checkSession().then(async (user) => {

        await Staff.findAll()

        await Product.findAll()

        await User.findAll()

        await Customer.findAll()

        global.user = user

        this.setState({ user, loading: false });

        hideLoading()

      }).catch((error) => {

        showMessage(error)

        hideLoading()

        this.setState({
          user: null,
          loading: false,
        })

      })
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  render() : React.ReactNode {

    var { user } = this.state

    return (

      <Provider store={store}>

        <View style={styles.container}>

          <LoadingModal />

          {
            !this.state.loading ?
              user ?
                user.role == UserRoles.ADMIN ? <LoggedInAdmin/> :
                user.role == UserRoles.TAILOR ? <LoggedInTailor/> :
                user.role == UserRoles.CUSTOMER ? <LoggedInCustomer/> :
                <LoggedOut/> :
              <LoggedOut/> :
            <InitialLoading/>
          }

        </View>

      </Provider>

    );
  }
}

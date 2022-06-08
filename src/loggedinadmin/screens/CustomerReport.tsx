/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { Component, PureComponent } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import { List, ListItem, Badge } from 'react-native-elements'

import { connect } from 'react-redux'
import Screen from '../../ui/components/Screen'
import SimpleListItem from '../../ui/components/list/SimpleListItem'
import * as Theme from '../../theme'

import { Utils } from '../../util/utils'
import { User } from '../../util/user'
import { Customer } from '../../util/customer'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'

const styles = StyleSheet.create({

});
/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  dispatch: (Object) => any,
  navigation: NavigationScreenProp
}

/*
 * We use flow type to validate the State of the component
 */
type State = {
  user: Object,
  userData: Object,
  loading: any,
  customer: Object,
  customerProductsMeasurements: any[]
}

class CustomerReport extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Raport client',
  };

  constructor(props: Props, context: any) {

    super(props, context);

    this.state = {
      user: global.user,
      userData: global.userData,
      loading: false,
      customer: undefined,
      customerProductsMeasurements: []
    };

  }

  componentDidMount() {
    this.props.navigation.addListener(
      'willFocus',
      () => {
        this.refreshData()
      }
    )
  }

  refreshData = async () => {

    this.props.dispatch(showLoading());

    try{

      var customerId = this.props.navigation.getParam('customerId', '5e6de73fe96fb7001736408c')

      let customer = await Customer.findOne(customerId)
      let customerMeasurements = await Customer.getMeasurements(customerId)
      let customerProductSizes = await Customer.getProductsSizes(customerId)

      let customerProductsMeasurements = await Customer.getMeasurementsContent(customerMeasurements, customerProductSizes)

      this.setState({
        customer,
        customerProductsMeasurements
      });

      this.props.dispatch(hideLoading());

    }
    catch(error){
      console.log('Error to get customers report')
      console.log(error)
    }

  };

  render() {

    let customer = this.state.customer;
    let customerProductsMeasurements = this.state.customerProductsMeasurements;

    return (
      <Screen>

        { customer && (

        <ScrollView>

          <List containerStyle={{ marginTop: 0 }}>

            <SimpleListItem
              text={ customer.getFullName() }
              subtext="Nume client"
            />

            <SimpleListItem
              text={ customer.email }
              subtext="Email"
            />

            <SimpleListItem
              text={ customer.phone }
              subtext="Phone"
            />

            <SimpleListItem
              text={ customer.getHeight() + 'cm' }
              subtext="Inaltime"
            />

            <SimpleListItem
              text={ customer.getWeight() + 'kg' }
              subtext="Greutate"
            />

          </List>

          <View style={{ paddingLeft: 15, paddingRight: 15, marginTop: 15 }}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>Masuratori</Text>
            { customerProductsMeasurements.length ? customerProductsMeasurements.filter(item => !!item.content).map((item) => {
              return (
                <View key={item.product._id} style={{ marginTop: 15 }}>
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginBottom: 5
                  }}>
                    <View style={{ width: 130 }}>
                      <Badge containerStyle={[Theme.badgeStyle['primaryContainer'], { width: 120 }]}>
                        <Text style={ [{ fontSize: 13, fontWeight: 'bold' }, Theme.badgeStyle['primaryText']] }>{ item.product.name }</Text>
                      </Badge>
                    </View>
                    <View style={{ width: 130 }}>
                      { item.size ? (
                      <Badge containerStyle={[Theme.badgeStyle['successContainer'], { width: 'auto' }]}>
                        <Text style={ [{ fontSize: 12 }, Theme.badgeStyle['successText']] }>Marime: { item.size }</Text>
                      </Badge>
                      ) : null }
                    </View>
                  </View>
                  <Text>{ item.content }</Text>
                </View>
              )
            }) : (
              <Text>Nicio masuratoare salvata</Text>
            )}
          </View>

        </ScrollView>

        )}

      </Screen>
    );

  }
}

// connect allows the component to communicate with redux
export default connect()(CustomerReport);

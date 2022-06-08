/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { Component, PureComponent } from 'react'

import { StyleSheet, Text, View, FlatList, TouchableOpacity, Keyboard } from 'react-native'
import { List, ListItem, Badge } from 'react-native-elements'

import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import Screen from '../../ui/components/Screen'
import SubmitButton from '../../ui/components/form/SubmitButton'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import FormError from '../../ui/components/form/FormError'
import TextField from '../../ui/components/form/TextField'
import * as Theme from '../../theme'

import { Utils } from '../../util/utils'
import { User } from '../../util/user'
import { BaseModel } from "../../util/basemodel"
import { Staff, StaffRoles } from '../../util/staff'
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
  loading: Any
}


class CustomerListItem extends PureComponent {

   render(){

      const { item, onPress } = this.props

      return (

        <TouchableOpacity onPress={onPress}>

          <View style={{ padding: 0 }}>

            <View style={{
              padding: 8,
              paddingVertical: 10,
              borderBottomColor: 'gray',
              borderBottomWidth: StyleSheet.hairlineWidth
            }}>

              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>

                <View style={{ width: '60%' }}>

                  <View style={{ width: '100%', flex:1, flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                      <Text>{ item.getFullName() || '' }</Text>
                    </Text>

                  </View>

                  <Text style={{ fontSize: 13, marginTop: 5 }}>
                    <Text style={{ fontWeight: 'bold', color: '#9b9b9b' }}>{ item.phone }</Text>
                  </Text>

                </View>

                <View style={{ width: '40%', flex: 1, flexDirection: 'row', justifyContent: "flex-end" }}>
                  <Badge containerStyle={[Theme.badgeStyle['primaryContainer'], { marginRight: 5 }]}>
                    <Text style={ [{ fontSize: 12 }, Theme.badgeStyle['primaryText']] }>{ item.height }cm</Text>
                  </Badge>
                  <Badge containerStyle={ Theme.badgeStyle['dangerContainer'] }>
                    <Text style={ [{ fontSize: 12 }, Theme.badgeStyle['primaryText']] }>{ item.weight }kg</Text>
                  </Badge>
                </View>

              </View>

            </View>

          </View>

        </TouchableOpacity>
      )
   }

}


class ReportsDashboard extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Rapoarte',
  };

  constructor(props: Props, context: any) {

    super(props, context);

    this.state = {
      user: global.user,
      userData: global.userData,
      loading: false,
      customers: []
    };

  }

  componentDidMount() {

    this.props.navigation.addListener(
      'willFocus',
      () => {

      }
    )

  }

  refreshData = async (height: number = 0, weight: number = 0) => {

    this.props.dispatch(showLoading());

    try{

      let customers = await Customer.getReport(height, weight);

      let formatedCustomers = await BaseModel.modelsParse(Customer, customers);

      this.setState({
        customers: formatedCustomers
      });

      this.props.dispatch(hideLoading());

    }
    catch(error){
      console.log('Error to get customers report')
      console.log(error)
    }

  };

  onSubmit = async(valuesObj) => {

    var values = Object.assign({}, valuesObj)

    if(!values.height && !values.weight){
        alert('Te rugam sa completezi cel putin unul dintre cele doua campuri: inaltimea si greutatea');
        return;
    }

    let height = parseInt(values.height);
    let weight = parseInt(values.weight);

    if(values.height && isNaN(parseInt(values.height))){
        alert('Inaltimea introdusa este incorecta');
        return;
    }

    if(values.weight && isNaN(parseInt(values.weight))){
        alert('Greutatea introdusa este incorecta');
        return;
    }

    // Dismiss keyboard
    Keyboard.dismiss();

    if(isNaN(parseInt(values.height))){
        height = 0;
    }

    if(isNaN(parseInt(values.weight))){
        weight = 0;
    }

    if(values.height && height < 10){
        alert('Va rugam sa introduceti inaltimea in centimetrii. Exemplu ok: 150, Exemplu gresit 1.50');
        return;
    }

    await this.refreshData(height, weight);

  }

  goToCustomerReport = (customerId) => {
    this.props.navigation.navigate('CustomerReport', {
        customerId: customerId
    })
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        component={CustomerListItem}
        item={item}
        onPress={() => { this.goToCustomerReport(item._id) }}
      />
    )
  }

  render() {

    const {
      error,
      handleSubmit,
      invalid,
      submitting,
    } = this.props

    return (
      <Screen>

          <View style={{ height: 60 }}>

            <FormError error={error} />

            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              backgroundColor: '#dedede'
            }}>

              <View style={{ width: '40%' }}>
                  <Field
                    component={TextField}
                    name="height"
                    placeholder="Inaltime"
                    keyboardType="number-pad"
                    style={{ textAlign: 'center' }}
                  />
              </View>

              <View style={{ width: '40%' }}>
                  <Field
                    component={TextField}
                    name="weight"
                    placeholder="Greutate"
                    keyboardType="number-pad"
                    style={{ textAlign: 'center' }}
                  />
              </View>

              <View style={{ width: '20%', flex: 1, flexDirection: 'row', justifyContent: "center" }}>
                  <SubmitButton
                    disabled={invalid && !error}
                    loading={submitting}
                    onPress={handleSubmit(this.onSubmit)}
                    icon="ios-search"
                    circleButton={true}
                  />
              </View>

            </View>

          </View>

          { this.state.customers.length ? (
            <List containerStyle={{marginTop:0}}>

                <FlatList
                  data={this.state.customers}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem}
                />

            </List>
          ) : (
            <Text style={{ paddingTop: 20, color: '#f00', textAlign: 'center', fontWeight: 'bold' }}>Niciun client gasit</Text>
          )}

      </Screen>
    );

  }
}

// connect allows the component to communicate with redux
export default withNavigation(reduxForm({
  form: 'ReportsDashboard',
})(ReportsDashboard))

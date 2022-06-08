/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { Component, PureComponent } from 'react'

import { connect } from 'react-redux'

import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { List, ListItem, Badge } from 'react-native-elements'

import Screen from '../../ui/components/Screen'
import * as Theme from '../../theme'

import { Utils } from '../../util/utils'
import { User } from '../../util/user'
import { Staff, StaffRoles } from '../../util/staff'
import { Customer } from '../../util/customer'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'

const styles = StyleSheet.create({

});

class StaffListItem extends PureComponent {

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

                <View style={{ width: '80%' }}>

                  <View style={{ width: '100%', flex:1, flexDirection: 'row', alignItems: 'center' }}>

                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                      <Text>{ item.getFullName() || '' }</Text>
                      <Text> - </Text>
                      <Text style={{ fontWeight: 'normal', fontSize: 14, color: '#9b9b9b' }}>{  item.type == 'tailor' ? 'Croitor' : 'Customer care' }</Text>
                    </Text>

                    { item.type == StaffRoles.TAILOR ? (
                        <Text style={ [{ fontSize: 12, color: Theme[item.available ? 'SUCCESS' : 'DANGER']}] }>
                          { [" - ", item.available ? 'Liber' : 'Ocupat'].join('') }
                        </Text>
                    ) : null }

                  </View>

                  <Text style={{ fontSize: 13, marginTop: 5 }}>
                    <Text style={{ fontWeight: 'bold', color: '#9b9b9b' }}>Comenzi: </Text>
                    <Text style={{ color: '#000' }}>{ item.orders }</Text>
                  </Text>

                </View>

                <View style={{ width: '20%' }}>

                  <Badge containerStyle={ Theme.badgeStyle[ (item.rating < 7 ? item.rating < 5 ? 'danger' : 'warning' : 'primary') + 'Container'] }>
                    <Text style={ [{ fontSize: 12 }, Theme.badgeStyle['success' + 'Text']] }>{ item.rating }</Text>
                  </Badge>

                </View>

              </View>

            </View>

          </View>

        </TouchableOpacity>
      )
   }

}

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

class StaffDashboard extends Component<Props, State> {

  static navigationOptions = {
    headerTitle: 'Personal',
  };

  constructor(props: Props, context: any) {

    super(props, context);

    this.state = {
      user: global.user,
      userData: global.userData,
      loading: false,
      staff: []
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

      var staff = await Staff.findAll(true)

      this.setState({staff});

      this.props.dispatch(hideLoading());

    }
    catch(error){
      console.log('Error to get staff members')
      console.log(error)
    }

  };

  renderItem = ({ item }) => {
    return (
      <ListItem
        component={StaffListItem}
        item={item}
      />
    )
  }

  render() {

    const staff = Utils.sortByField(this.state.staff, 'type')

    return (
      <Screen>

        <List containerStyle={{marginTop:0}}>

          <FlatList
            data={staff}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
          />

        </List>

      </Screen>
    );

  }
}

export default connect()(StaffDashboard);

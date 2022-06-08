/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { connect } from 'react-redux';

import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import { List, ListItem, Badge } from 'react-native-elements';

import Screen from '../../ui/components/Screen';
import { SearchableFlatList } from "react-native-searchable-list";
import * as Theme from '../../theme'


import { Utils } from '../../util/utils'
import { User } from '../../util/user'
import { Order } from '../../util/order'
import { Staff } from '../../util/staff'
import { Customer } from '../../util/customer'
import { hideLoading, showLoading } from '../../ui/redux/uiActions';

const styles = StyleSheet.create({
    noOrdersText: {
        textAlign: "center",
        fontWeight: "bold",
        padding: 15,
        color: Theme.DANGER
    },
    searchInput: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        height: 35,
        backgroundColor: '#fff',
        color: Theme.PRIMARY
    },
    searchWrapper: {
        backgroundColor: Theme.PRIMARY,
        paddingHorizontal: 5,
        paddingBottom: 5
    }
})

type Props = {
  // The redux dispatch function
  dispatch: (Object) => any,
  navigation: NavigationScreenProp<*, *>,
}

class OrderListItem extends React.PureComponent {

   render(){

      const { item, onPress } = this.props

      const orderStatus = Order.getStatus(item)

      return (

        <TouchableOpacity onPress={onPress}>

          <View style={{
            padding: 8,
            paddingTop:0,
            paddingBottom:0,
            borderBottomColor: 'gray',
            borderBottomWidth: StyleSheet.hairlineWidth
          }}>

            <View style={{
              padding: 8
            }}>

              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>

                <View style={{ width: '70%' }}>

                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{ item.customer.getFullName() }</Text>

                  <Text style={{ color: '#aaa', fontSize: 13 }}>{ item.customer.email }</Text>

                </View>

                <View style={{ width: '30%' }}>
                  <Badge containerStyle={ [Theme.badgeStyle[orderStatus.color + 'Container'], {marginBottom: 10}] }>
                    <Text style={ [{ fontSize: 12, textAlign:"center" }, Theme.badgeStyle[orderStatus.color + 'Text']] }>{ orderStatus.text }</Text>
                  </Badge>
                  <Badge containerStyle={{ backgroundColor: 'red'}}>
                    <Text style={{ color: '#fff', fontSize: 11 }}>{ item.getDeadline('DD/MM/YYYY') }</Text>
                  </Badge>
                </View>

              </View>

            </View>

          </View>

        </TouchableOpacity>
      )
   }

}

class Orders extends React.Component<*> {

  static navigationOptions = {
    headerTitle: 'Comenzi',
  };

  constructor(props: Props, context: any) {

    super(props, context);

    this.state = {
      user: global.user,
      loading: false,
      customers: [],
      orders: [],
      searchTerm: ''
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

    const { page, seed } = this.state;

    this.setState({ loading: true });

    try{

      var customers = await Customer.findAll()

      var orders = await Order.findAllForTailors()

      // Create the index field for search
      for(let order of orders){
            order.searchField = [order.customer.firstName, order.customer.lastName, order.customer.email, order.shipping.address, order.shipping.phone].join(' ')
      }

      this.setState({orders, customers});

      this.props.dispatch(hideLoading());

    }
    catch(error){
      console.log('Error to get orders and customers')
      console.log(error)
    }

    this.setState({ loading: false });

  };

  goToOrder = (orderId) => {
    this.props.navigation.navigate('OrderDetails', {
      orderId: orderId
    });
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        component={OrderListItem}
        item={item}
        onPress={() => {this.goToOrder(item._id)}}
      />
    )
  }

  render() {

    const orders = Utils.sortByField(this.state.orders, 'tailors.deadline')

    return (
        <Screen>

            { orders && orders.length ? (
              <View>

                  <View style={styles.searchWrapper}>
                      <TextInput
                          style={styles.searchInput}
                          placeholder={"Cauta dupa nume, email, telefon, adresa ..."}
                          onChangeText={searchTerm => this.setState({ searchTerm })}
                       />
                   </View>

                  <List containerStyle={Theme.styles.listContainer}>

                    <SearchableFlatList
                      data={orders}
                      searchTerm={this.state.searchTerm}
                      searchAttribute={'searchField'}
                      ignoreCase={true}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={this.renderItem}
                    />

                  </List>
              </View>

            ) : (
              <Text style={Theme.styles.noElementsText}>Nicio comanda</Text>
            )}

         </Screen>
    );

  }
}

export default connect()(Orders);

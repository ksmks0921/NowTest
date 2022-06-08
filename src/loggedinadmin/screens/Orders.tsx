/**
 * @flow
 *
 * The Logged In Home screen is a simple screen indicating that the user has logged in.
 */
import React from 'react'
import { Component, PureComponent } from 'react'
import Swipeout from 'react-native-swipeout';

import { connect } from 'react-redux'

import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native'
import { SearchableFlatList } from "react-native-searchable-list";
import { List, ListItem, Badge } from 'react-native-elements'

import Screen from '../../ui/components/Screen'
import TextField from '../../ui/components/form/TextField'
import * as Theme from '../../theme'

import { Utils } from '../../util/utils'
import { User } from '../../util/user'
import { Order } from '../../util/order'
import { Customer } from '../../util/customer'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'

class OrderListItem extends PureComponent {

    render() {

        const { item, onPress } = this.props

        const orderStatus = Order.getStatus(item)

        return (

            <Swipeout style={{ backgroundColor: 'transparent' }} sensitivity={20} right={[
                {
                    text: 'Sterge',
                    backgroundColor: Theme.DANGER,
                    onPress: () => {
                        item.remove()
                    }
                }
            ]}>

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

                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{ item.customer.getFullName() }</Text>

                        {
                          item.tailors.view && (
                            <View>
                              <Badge containerStyle={{ backgroundColor: Theme.PRIMARY, marginLeft: 20 }}>
                                <Text style={{ color: '#fff', fontSize: 10 }}>La croitorie</Text>
                              </Badge>
                            </View>
                          )
                        }

                        {
                          item.parameters.problems && (
                            <View>
                              <Badge containerStyle={{ backgroundColor: Theme.DANGER, marginLeft: 20 }}>
                                <Text style={{ color: '#fff', fontSize: 10 }}>Gresita</Text>
                              </Badge>
                            </View>
                          )
                        }

                      </View>

                      <Text style={{ color: '#aaa', fontSize: 13, marginBottom: 10 }}>
                        { item.customer.email }
                      </Text>

                      {
                        item.getDeadline() ? (
                          <Text style={{ fontSize: 13 }}>
                            <Text style={{ color: '#9b9b9b' }}>Terminare inainte de: </Text>
                            <Text style={{ color: '#f00', fontSize: 12 }}>
                              { item.getDeadline('DD/MM/YYYY') }
                            </Text>
                          </Text>
                        ) : null
                      }

                      {
                        item.getShippingDate() ? (
                          <Text style={{ fontSize: 13 }}>
                            <Text style={{ color: '#9b9b9b' }}>Expediere pe: </Text>
                            <Text style={{ color: '#f00', fontSize: 12 }}>
                              { item.getShippingDate('DD/MM/YYYY') }
                            </Text>
                          </Text>
                        ) : null
                      }

                    </View>

                    <View style={{ width: '40%' }}>
                      <Badge containerStyle={ Theme.badgeStyle[orderStatus.color + 'Container'] }>
                        <Text style={ [{ fontSize: 12, textAlign:"center" }, Theme.badgeStyle[orderStatus.color + 'Text']] }>{ orderStatus.text }</Text>
                      </Badge>
                    </View>

                  </View>

                </View>

              </View>

            </TouchableOpacity>
        </Swipeout>
        )
    }

}

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
    loading: Any,
    customers: Array,
    orders: Array
}

class Orders extends Component < Props, State > {

    static navigationOptions = {
        headerTitle: 'Comenzi',
    }

    constructor(props: Props, context: any) {

        super(props, context)

        this.state = {
            user: global.user,
            userData: global.userData,
            loading: false,
            customers: [],
            orders: [],
            searchTerm: ''
        }

    }

    componentDidMount() {

        /*this.props.navigation.navigate('OrderReview', {
            orderId: '5bcc94463f31742e59843787'
        })
        return*/

        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.refreshData()
            }
        )

    }

    refreshData = async () => {

        this.props.dispatch(showLoading())

        const { page, seed } = this.state

        this.setState({ loading: true })

        try {

            var customers = await Customer.findAll()

            var orders = await Order.findAll()

            // Create the index field for search
            for(let order of orders){

                order.remove = () => {
                    this.deleteOrder(order)
                }

                order.searchField = [
                    order.customer.firstName, order.customer.lastName, order.customer.email, order.shipping.address, order.shipping.phone
                ].join(' ')

            }

            this.setState({ orders, customers })

            this.props.dispatch(hideLoading())

        } catch (error) {
            console.log('Error to get orders and customers')
            console.log(error)
        }

        this.setState({ loading: false })

    }

    goToOrder = (orderId) => {
        this.props.navigation.navigate('OrderDetails', {
            orderId: orderId
        })
    }

    renderItem = ({ item }) => {
        return (
            <ListItem
                component={OrderListItem}
                item={item}
                key={item._id}
                onPress={() => {this.goToOrder(item._id)}}
            />
        )
    }

    deleteOrder = async (order:any) => {
        this.props.dispatch(showLoading())
        await order.delete()
        this.refreshData()
    }

    render() {

        const { orders } = this.state

        Utils.sortByField(orders, 'createdAt', true)

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
        )

    }
}

export default connect()(Orders)

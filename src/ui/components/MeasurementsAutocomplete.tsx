import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet } from 'react-native';

import Button from './Button'
import * as Theme from '../../theme';

import { Customer } from '../../util/customer';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 250,
        justifyContent: 'center',
        width: 250,
    },
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(204, 204, 204, 0.7)',
        flex: 1,
        justifyContent: 'center',
    },
    buttonsWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsColumn: {
        width: '50%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 30,
        width: '70%',
        alignSelf: 'auto',
        paddingVertical: 0
    },
    buttonClose: {
        backgroundColor: 'transparent'
    },
    buttonCloseText: {
        color: Theme.DANGER
    },
    importTitle: {
        marginTop: 40,
        color: 'gray'
    },
    importCustomerName: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default class extends Component {

    state = {
        modalVisible: false,
    };

    public callback?:Function = undefined
    public callbackCtx:any = undefined

    setModalVisible(visible:boolean) {
        this.setState({ modalVisible: visible });
    }

    async importMeasurements(){

        const { order } = this.props as any

        const measurements = await Customer.getMeasurements(order.customer)

        if(measurements && this.callback){
            this.callback.call(this.callbackCtx, measurements)
        }

        this.setState({ modalVisible: false });

    }

    setCallback(fnc:Function, context:any){
        this.callback = fnc
        this.callbackCtx = context
    }

    render() {

        const { order } = this.props as any

        if (!order) {
            return null
        }

        return (
            <View style={{marginTop: 22}}>

            <Modal
              animationType="slide"
              transparent={true}
              visible={ this.state.modalVisible }>

              <View style={styles.overlay}>

                <View style={styles.container}>

                  <Text style={styles.importTitle}>Preluare masuratori de la:</Text>
                  <Text style={styles.importCustomerName}>{ order.customer.getFullName() }</Text>

                  <View style={styles.buttonsWrapper}>

                    <View style={styles.buttonsColumn}>
                      <Button
                        text="Renunta"
                        styleType="danger"
                        textStyle={styles.buttonCloseText}
                        containerStyle={[styles.button, styles.buttonClose]}
                        onPress={() => {
                          this.setModalVisible(false);
                        }}
                      />
                    </View>

                    <View style={styles.buttonsColumn}>
                      <Button
                        text="Importare"
                        styleType="success"
                        containerStyle={styles.button}
                        onPress={() => {
                            this.importMeasurements(order)
                        }}
                      />
                    </View>

                  </View>

                </View>

              </View>

            </Modal>

        </View>
        )
    }
}

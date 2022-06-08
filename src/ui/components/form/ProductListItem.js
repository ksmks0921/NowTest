/**
 * @flow
 *
 * The Screen component acts as a wrapper for all our screens so that any styles can be applied
 * consistently across all screens
 */
import React from 'react';
import PropTypes from "prop-types";
import { StyleSheet, Component, View, Text, Image, TextInput } from 'react-native';

import type { FieldProps } from 'redux-form';
import * as Theme from '../../../theme';

import TextField from '../form/TextField'
import Button from '../Button'
import Icon from '../Icon';

import { Product } from '../../../util/product'

type Props = {
  placeholder: string,
} & FieldProps;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.BORDER_COLOR,
    flexDirection: 'row',
    padding: 5,
  },
  nameContainer:{
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    height: '100%',
    paddingLeft: 8
  },
  imageContainer:{

  },
  buttonsContainer:{
    flex: 1,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems:'center',
    height: '100%',
    paddingLeft: 8,
    width: 200
  },
  image: {
    height: 80,
    width: 70,
  },
  name: {
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 50,
    textAlign: 'center'
  },
  buttonContainer:{
    padding: 0,
    height: 40,
    width: 40,
  },
  buttonText: {
    fontSize: 24,
  }
});

export default class ProductListItem extends React.Component<Props> {

  input: TextInput | null;

  state = {
    currentInputValue: null
  };

  constructor(props){

    super()

    this.state.currentInputValue = props.value ? props.value.toString() : '1'

  }

  componentDidMount(){
    this.setValue(this.state.currentInputValue)
  }

  onFocus = () => {
    this.input.blur();
    this.setState({ visible: true });
  }

  focus = () => {
    if (this.input) this.input.focus();
  }

  setValue = (value, disableInputUpdate) => {

    this.setState({
      currentInputValue: value.toString()
    })

    this.props.input.onChange(parseInt(value))

  }

  decrementValue = () => {
    this.setValue(Math.max(0, parseInt(this.state.currentInputValue) - 1))
  }

  incrementValue = () => {
    this.setValue(parseInt(this.state.currentInputValue) + 1)
  }

  changeValue = (value) => {
    this.setValue(parseInt(value))
  }

  render() {

    const {
      product,
      input: {
        onChange,
        ...restInput
      },
      meta: {
        error,
        touched,
      },
      ...props
    } = this.props;

    const {
      currentInputValue
    } = this.state;

    return (
      <View style={styles.container}>

      <View style={styles.imageContainer}>
        <Image resizeMode="contain" source={product.image} style={styles.image} />
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.name}>
          {product.name}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>

        <Button
          styleType="secondary"
          circleButton
          containerStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          text="-"
          onPress={this.decrementValue}></Button>

        <TextInput
          onChangeText={this.changeValue}
          style={[styles.input]}
          value={currentInputValue}
        />

        <Button
          styleType="secondary"
          circleButton
          containerStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          text="+"
          onPress={this.incrementValue}></Button>

      </View>

    </View>
    );
  }
}

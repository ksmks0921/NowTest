/**
 * @flow
 *
 * The Screen component acts as a wrapper for all our screens so that any styles can be applied
 * consistently across all screens
 */
import React from 'react';
import PropTypes from "prop-types";
import { StyleSheet, Component, View, Text, Switch as SwitchNative } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import type { FieldProps } from 'redux-form';
import * as Theme from '../../../theme';
import moment from 'moment';

type Props = {
  seamless: boolean,
  placeholder: string,
} & FieldProps;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderColor: Theme.BORDER_COLOR,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    margin: 8,
    paddingLeft: 8,
    paddingRight: 8
  },
  containerError: {
    borderColor: Theme.ERROR_COLOR,
  },
  icon: {
    backgroundColor: 'transparent',
    color: '#999',
    fontSize: 18,
    marginLeft: 16,
    textAlign: 'center',
    width: 24,
  },
  input: {
    color: '#000',
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    height: 50,
    marginLeft: 8,
    marginRight: 16,
  },
});

export default class SwitchField extends React.Component<Props> {

  input: Switch | null;

  state = {
    currentValue: false,
  };

  componentWillReceiveProps(nextProps){

    if(!nextProps.input.value){
      this.setState({ currentValue : false })
    }

  }

  changedValue = (value) => {
    this.setState({ currentValue: value })
    this.props.input.onChange ? this.props.input.onChange(value) : ''
  }

  focus = () => {
    if (this.input) this.input.focus();
  }

  render() {

    const {
      placeholder,
      seamless,
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

    const { currentValue } = this.state

    return (

      (!seamless && placeholder) ? (

        <View style={ [styles.container, touched && !!error && styles.containerError] }>

          <View style={{ height: 50 }}>

            <View style={{
              height: 50,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>

              <View style={{ width: '70%' }}>
                <Text>{placeholder}</Text>
              </View>

              <View style={{ width: '30%', alignItems:'flex-end' }}>

                <SwitchNative
                  ref={(ref) => { this.input = ref; }}
                  value={currentValue}
                  onValueChange={this.changedValue}
                />

              </View>

            </View>

          </View>

        </View>

      ) : (

        <SwitchNative
          ref={(ref) => { this.input = ref; }}
          value={currentValue}
          onValueChange={this.changedValue}
        />

      )
    )

  }
}

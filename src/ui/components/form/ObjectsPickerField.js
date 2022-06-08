/**
 * @flow
 *
 * The Screen component acts as a wrapper for all our screens so that any styles can be applied
 * consistently across all screens
 */
import React from 'react';
import PropTypes from "prop-types";
import { StyleSheet, Component, View, Text, TextInput } from 'react-native';

import Icon from '../Icon';
import type { FieldProps } from 'redux-form';

import * as Theme from '../../../theme';

import moment from 'moment';

import ModalFilterPicker from 'react-native-modal-filter-picker'

type Props = {
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
    margin: 8
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
    marginRight: 16
  },
});

export default class DateTimePickerField extends React.Component<Props> {

  input: TextInput | null;

  state = {
    visible: false,
    picked: null,
    currentInputValue: null
  };

  componentWillReceiveProps(nextProps){

    if(!nextProps.input.value){
      this.setState({ currentInputValue : '' })
    }

    var { defaultPicked, objects } = nextProps

    if(defaultPicked){

      var foundItems = objects.filter(item => { return item.key == defaultPicked })

      if(foundItems.length){

        this.setState({
          picked: defaultPicked,
          visible: false,
          currentInputValue: foundItems[0].label
        })

        this.props.input.onChange(defaultPicked)

      }
    }
  }

  onFocus = () => {
    this.input.blur();
    this.setState({ visible: true });
  }

  focus = () => {
    if (this.input) this.input.focus();
  }

  onChange(){
    console.log('Changed the text ')
  }

  onSelect = (picked) => {

    var foundItems = this.props.objects.filter(item => { return item.key == picked })

    if(!foundItems.length) return

    this.setState({
      picked: picked,
      visible: false,
      currentInputValue: foundItems[0].label
    })

    this.props.input.onChange(picked)

  }

  onCancel = () => {

    this.setState({
      visible: false
    });

    this.props.input.onChange(null)

  }

  render() {

    const {
      icon,
      objects,
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
      visible,
      picked,
      currentInputValue
    } = this.state;

    return (
      <View style={[styles.container, touched && !!error && styles.containerError]}>

        {icon && <Icon active name={icon} style={styles.icon} />}

        <ModalFilterPicker
          visible={visible}
          onSelect={this.onSelect}
          onCancel={this.onCancel}
          options={objects}
        />

        <TextInput
          onChangeText={onChange}
          ref={(ref) => { this.input = ref; }}
          style={styles.input}
          value={currentInputValue}
          onFocus={this.onFocus}
          {...props}
        />

      </View>
    );
  }
}

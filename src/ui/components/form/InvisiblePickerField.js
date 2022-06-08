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

export default class InvisiblePickerField extends React.Component<Props> {

  input: TextInput | null;

  state = {
    visible: false,
    picked: null
  };

  show = () => {
    this.setState({ visible: true });
  }

  hide = () => {
    this.setState({ visible: false });
  }

  onSelect = (picked) => {
    this.setState({
      picked: picked,
      visible: false
    })
    this.props.onChange && this.props.onChange(picked)
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
    this.props.onChange && this.props.onChange(null)
  }

  render() {

    const {
      icon,
      objects,
      onChange,
      ...props
    } = this.props;

    const {
      visible,
      picked
    } = this.state;

    return (
      <View style={[styles.container]}>

        {icon && <Icon active name={icon} style={styles.icon} />}

        <ModalFilterPicker
          visible={visible}
          onSelect={this.onSelect}
          onCancel={this.onCancel}
          options={objects}
        />

      </View>
    );
  }
}

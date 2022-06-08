/**
 * @flow
 *
 * The Screen component acts as a wrapper for all our screens so that any styles can be applied
 * consistently across all screens
 */
import React from 'react';
import PropTypes from "prop-types";
import { StyleSheet, Component, View, Text, TextInput } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from '../Icon';
import type { FieldProps } from 'redux-form';
import * as Theme from '../../../theme';
import moment from 'moment';

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
    margin: 8,
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

export default class DateTimePickerField extends React.Component<Props> {

  input: TextInput | null;

  state = {
    isDateTimePickerVisible: false,
  };

  showDateTimePicker = () => {
     this.setState({ isDateTimePickerVisible: true });
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }

  handleDatePicked = (date) => {
    this.props.input.onChange(moment(date).format('DD/MM/YYYY'))
    this.hideDateTimePicker();
  }

  onFocus = () => {
    this.input.blur();
    this.showDateTimePicker()
  }

  focus = () => {
    if (this.input) this.input.focus();
  }

  render() {

    const {
      icon,
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

    const { isDateTimePickerVisible } = this.state

    return (
      <View style={[styles.container, touched && !!error && styles.containerError]}>

        {icon && <Icon active name={icon} style={styles.icon} />}

        <TextInput
          onChangeText={onChange}
          ref={(ref) => { this.input = ref; }}
          style={styles.input}
          {...restInput}
          {...props}
          onFocus={this.onFocus}
        />

        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />

      </View>
    );
  }
}

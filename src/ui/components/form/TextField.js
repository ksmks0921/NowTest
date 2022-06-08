/**
 * @flow
 *
 * The TextField component displays a text field
 */
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { FieldProps } from 'redux-form';

import Icon from '../Icon';
import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The icon to display as part of the text field
  icon: string,

  inputStyle: object
// The props inherit from the built in `redux-form` FieldProps
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

export default class TextField extends React.Component<Props> {
  input: TextInput | null;

  render() {
    const {
      icon,
      inputStyle,
      style,
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

    return (
      <View
        style={[styles.container, touched && !!error && styles.containerError, style]}>
        {icon && <Icon active name={icon} style={styles.icon} />}
        <TextInput
          onChangeText={onChange}
          ref={(ref) => { this.input = ref; }}
          style={[styles.input, inputStyle]}
          placeholderTextColor="#bbb"
          {...restInput}
          {...props}
        />
      </View>
    );
  }

  /*
   * Expose a focus method to allow parent Components to focus the text field programmatically
   */
  focus = () => {
    if (this.input) this.input.focus();
  }
}

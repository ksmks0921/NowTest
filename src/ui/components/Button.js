/**
 * @flow
 *
 * The Button component acts as a standard button with optional text and icon
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import Icon from './Icon';
import * as Theme from '../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The optional style for the button container
  containerStyle?: StyleObj,
  // Whether the button is disabled
  disabled?: boolean,
  // The optional icon to show as part of the button
  icon?: string,
  // The optional style for the button icon
  iconStyle?: StyleObj,
  // The action to call when the button is pressed
  onPress: () => any,
  // The optional text to show as part of the button
  text?: string,
  // The optional style for the button text
  textStyle?: StyleObj,

  circleButton: boolean,

  styleType: string
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Theme.BUTTON,
    borderRadius: 22,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center',
    margin: 4,
  },
  circleButton: {
    alignSelf:'auto',
    height: 50,
    width: 50,
    borderRadius: 25
  },
  disabled: {
    backgroundColor: Theme.BUTTON_DISABLED,
  },
  icon: {
    color: '#fff',
    margin: 4,
    width: 45,
  },
  circleIconButton: {
    color: '#fff',
    fontSize: 40,
    width: 50,
    textAlign: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 15
  },
  textWithIcon: {
    marginLeft: 8
  },
  circleButtonText: {
    marginLeft: 0,
  },
  secondaryContainer: {
    backgroundColor: Theme.SECONDARY,
  },
  secondaryText: {
    color: '#fff'
  },
  successContainer: {
    backgroundColor: Theme.SUCCESS,
  },
  successText: {
    color: '#fff'
  },
  dangerContainer: {
    backgroundColor: Theme.DANGER,
  },
  dangerText: {
    color: '#fff'
  },
  warningContainer: {
    backgroundColor: Theme.WARNING,
  },
  warningText: {
    color: '#fff'
  },
});

export default (props: Props) => {
  const {
    containerStyle,
    circleButton,
    disabled,
    icon,
    iconStyle,
    styleType,
    onPress,
    text,
    textStyle,
    ...restProps
  } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        disabled && styles.disabled,
        circleButton && styles.circleButton,
        styleType && styles[styleType + 'Container'],
        containerStyle
      ]}
      {...restProps}>

      { icon ? <Icon active name={icon} style={[styles.icon, iconStyle, circleButton && styles.circleIconButton, styleType && styles[styleType + 'Text']]} /> : null }

      { text ? <Text style={[styles.text, textStyle, icon && textWithIcon, circleButton && styles.circleButtonText]}>{text}</Text> : null }

    </TouchableOpacity>
  );
};

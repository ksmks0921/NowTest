/**
 * @flow
 *
 * The IconButton component acts as a simple button with just an Icon displayed
 */
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import Icon from './Icon';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The optional style for the button container
  containerStyle?: StyleObj,
  // The icon to display
  icon: string,
  // The optional style for the button icon
  iconStyle?: StyleObj,
  // The action to call when the button is pressed
  onPress: () => any,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 22.5,
    height: 45,
    justifyContent: 'center',
    margin: 4,
    width: 45,
  },
  icon: {
    fontSize: 30,
    height: 30,
    lineHeight: 30,
  },
});

export default (props: Props) => {
  const {
    containerStyle,
    icon,
    iconStyle,
    onPress,
    ...restProps
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      {...restProps}>
      <Icon active name={icon} style={[styles.icon, iconStyle]} />
    </TouchableOpacity>
  );
};

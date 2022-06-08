/**
 * @flow
 *
 * The LinkButton component acts as a simple link
 */
import React, { type Node } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The optional children to include within the link
  children?: Node,
  // The optional style for the link container
  containerStyle?: StyleObj,
  // The optional text to show as part of the link
  text?: string,
  // The optional style for the link text
  textStyle?: StyleObj,
  // The action to call when the link is pressed
  onPress: () => any,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 4,
  },
});

export default (props: Props) => {
  const {
    containerStyle,
    onPress,
    text,
    textStyle,
    ...restProps
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      {...restProps}>
      {text
        ? <Text style={[textStyle]}>{text}</Text>
        : props.children
      }
    </TouchableOpacity>
  );
};

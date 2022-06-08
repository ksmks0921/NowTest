/**
 * @flow
 *
 * The ListItem component can be used to display an item in a list with text and optional icon.
 * The item can be clickable.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Icon from '../Icon';
import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // An optional icon to display in the list item
  icon?: string,
  // An optional method that will be called on clicking the item
  onPress?: () => any,
  // The text to display in the list item
  text: string,
}

const styles = StyleSheet.create({
  buttonIcon: {
    fontSize: 24,
    color: '#333',
    marginLeft: 18,
  },
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.BORDER_COLOR,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  icon: {
    color: Theme.PRIMARY,
    fontSize: 24,
    marginRight: 16,
    textAlign: 'center',
    width: 30,
  },
  text: {
    flex: 1,
  },
});

export default (props: Props) => {
  const { icon, onPress, text } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon && <Icon active name={icon} style={styles.icon} />}
      <Text style={styles.text}>{text}</Text>
      <Icon name="ios-arrow-forward" style={styles.buttonIcon} />
    </TouchableOpacity>
  );
};

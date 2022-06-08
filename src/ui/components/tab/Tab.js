/**
 * @flow
 *
 * The Tab component displays a tab button
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Icon from '../Icon';
import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether the tab is currently active / selected
  active: boolean;
  // The text to display within the tab
  heading: string;
  // The icon to display within the tab
  icon: string;
  // The action to call when the tab is pressed
  onPress: () => any;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Theme.BORDER_COLOR,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  containerActive: {
    borderBottomWidth: 4,
    borderColor: Theme.PRIMARY,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  iconActive: {
    color: Theme.PRIMARY,
    paddingTop: 3,
  },
  text: {

  },
  textActive: {
    color: Theme.PRIMARY,
    paddingTop: 3,
  },
});

export default (props: Props) => {
  const {
    active,
    heading,
    icon,
    onPress,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, active && styles.containerActive]}>
      <Icon name={icon} style={[styles.icon, active && styles.iconActive]} />
      <Text style={[styles.text, active && styles.textActive]}>{heading}</Text>
    </TouchableOpacity>
  );
};

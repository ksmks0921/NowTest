/**
 * @flow
 *
 * The List component wraps a list of components
 */
import React, { type Node } from 'react';
import { StyleSheet, View } from 'react-native';

import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The children to display in the List component
  children: Node,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: Theme.BORDER_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 16,
  },
});

export default (props: Props) => (
  <View style={styles.container}>
    {props.children}
  </View>
);

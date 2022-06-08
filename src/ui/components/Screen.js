/**
 * @flow
 *
 * The Screen component acts as a wrapper for all our screens so that any styles can be applied
 * consistently across all screens
 */
import React, { type Node } from 'react';
import { StyleSheet, View } from 'react-native';

import * as Theme from '../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The children to display within the screen
  children: Node,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.SCREEN_BACKGROUND_COLOR,
    flex: 1,
    paddingTop:0
  },
});

export default (props: Props) => (
  <View style={styles.container}>
    {props.children}
  </View>
);

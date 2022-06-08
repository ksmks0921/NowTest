/**
 * @flow
 *
 * The Tabs component acts as a wrapper around `Tab` components
 */
import React, { type Node } from 'react';
import { StyleSheet, View } from 'react-native';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  children: Node,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50
  },
});

export default (props: Props) => (
  <View style={styles.container}>
    {props.children}
  </View>
);

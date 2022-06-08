/**
 * @flow
 *
 * The FormError component displays errors from `redux-form`
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // An optional error object from `redux-form`
  error?: Object,
}

const styles = StyleSheet.create({
  error: {
    color: Theme.ERROR_COLOR,
    lineHeight: 20,
    padding: 8,
    textAlign: 'center',
  },
  spacer: {
    height: 0,
  },
});

export default ({ error }: Props) => (error ? (
  <Text style={styles.error}>{error.message}</Text>
) : (
  <View style={styles.spacer} />
));

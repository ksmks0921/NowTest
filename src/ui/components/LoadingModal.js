/**
 * @flow
 *
 * The LoadingModal component acts as a simple loading overlay for use whilst waiting for
 * a remote task to complete.
 *
 * It is connected to Redux to determine whether it should be showing or not.
 */
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Store } from '../redux/uiReducer';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether the modal is visible
  loading: boolean,
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    height: 150,
    justifyContent: 'center',
    width: 150,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(204, 204, 204, 0.7)',
    flex: 1,
    justifyContent: 'center',
  },
});

const onRequestClose = () => {};

const mapStateToProps = state => ({
  loading: Store.isLoading(state),
});

// connect allows the component to communicate with redux
export default connect(mapStateToProps)(({ loading }: Props) => (
  <Modal
    onRequestClose={onRequestClose}
    transparent
    visible={loading}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  </Modal>
));

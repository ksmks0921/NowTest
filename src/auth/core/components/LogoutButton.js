/**
 * @flow
 *
 * The LogoutButton component triggers a logout from Firebase and any third party providers.
 */
import React from 'react'
import { Button } from 'react-native';
import { AuthService } from '../../../util/authservice'

import * as Theme from '../../../theme';

const logout = async () => {
    await AuthService.logout()
};

export default () => (
  <Button
    color="#fff"
    onPress={logout}
    title="Iesire"
  />
);

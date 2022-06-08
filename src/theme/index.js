/**
 * @flow
 *
 * This file configures the core colours used within the app.  Simply change the values here and
 * the application will be updated throughout.
 */

import { StyleSheet } from 'react-native';

export const PRIMARY = '#4d2d4a';
export const SECONDARY = '#6c757d';
export const SUCCESS = '#28a745';
export const DANGER = '#dc3545';
export const WARNING = '#ffc107';
export const INFO = '#17a2b8';

export const BORDER_COLOR = '#ccc';
export const BORDER_COLOR_DARK = '#999';

export const BUTTON = PRIMARY;
export const BUTTON_DISABLED = '#ccc';

export const ERROR_COLOR = '#ed2f2f';

export const SCREEN_BACKGROUND_COLOR = '#fff';

export const TOAST_TEXT_COLOR = '#fff';
export const TOAST_ERROR_BACKGROUND_COLOR = ERROR_COLOR;
export const TOAST_MESSAGE_BACKGROUND_COLOR = 'rgba(0,0,0,0.8)';
export const TOAST_WARNING_BACKGROUND_COLOR = '#f0ad4e';

export const HEADER_OPTIONS = {
    headerTintColor: 'white',
    headerStyle: { backgroundColor: PRIMARY, borderWidth: 0, borderBottomColor: PRIMARY },
    headerTitleStyle: { color: 'white' }
}

export const badgeStyle = StyleSheet.create({
  primaryContainer: {
    backgroundColor: PRIMARY
  },
  primaryText: {
    color: '#fff'
  },
  warningContainer: {
    backgroundColor: WARNING
  },
  warningText: {
    color: '#fff'
  },
  successContainer: {
    backgroundColor: SUCCESS
  },
  successText: {
    color: '#fff'
  },
  dangerContainer: {
    backgroundColor: DANGER
  },
  dangerText: {
    color: '#fff'
  },
  infoContainer: {
    backgroundColor: INFO
  },
  infoText: {
    color: '#fff'
  }
})

export const styles = StyleSheet.create({
  listContainer: {
    marginTop:0,
    height: "100%"
  },
  noElementsText: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 15,
    color: DANGER
  }
})

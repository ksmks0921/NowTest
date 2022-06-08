/**
 * @flow
 *
 * The Toast component wraps the `react-native-root-toast` Toast component to allow you to easily
 * replace this with an alternative Toast implementation if required
 *
 * It exposes a number of helper methods to show standard error, info and warning messages
 */
import Toast from 'react-native-root-toast';
import * as Theme from '../../theme';

export const showError = (data: any) => {
    data = typeof data === "object" && data.message ? data.message.message ? data.message.message : data.message : String(data);
    Toast.show(data, {
        backgroundColor: Theme.TOAST_ERROR_BACKGROUND_COLOR,
        duration: 5000,
        position: 50,
        textColor: Theme.TOAST_TEXT_COLOR,
        type: 'danger',
    });
};

export const showMessage = (data: any) => {
    data = typeof data === "object" && data.message ? data.message.message ? data.message.message : data.message : String(data);
    Toast.show(data, {
        backgroundColor: Theme.TOAST_MESSAGE_BACKGROUND_COLOR,
        duration: 5000,
        position: 50,
        textColor: Theme.TOAST_TEXT_COLOR,
    });
};

export const showWarning = (data: any) => {
    data = typeof data === "object" && data.message ? data.message.message ? data.message.message : data.message : String(data);
    Toast.show(data, {
        backgroundColor: Theme.TOAST_WARNING_BACKGROUND_COLOR,
        duration: 5000,
        position: 50,
        textColor: Theme.TOAST_TEXT_COLOR,
    });
};

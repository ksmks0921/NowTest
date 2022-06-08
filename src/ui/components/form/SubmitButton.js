/**
 * @flow
 *
 * The SubmitButton component displays a submit button
 */
import React from 'react';

import Button from '../Button';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // Whether the button should be disabled
  disabled: boolean,
  // If the form is currently loading / processing
  loading: boolean,
  // The action to perform when the button is pressed
  onPress: () => void,
  // The text to show on the submit button
  text: string,
}

export default (props: Props) => {
  const {
    disabled,
    loading,
    onPress,
    text,
    ...restProps
  } = props;

  return (
    <Button
      disabled={disabled || loading}
      onPress={onPress}
      text={text}
      {...restProps}
    />
  );
};

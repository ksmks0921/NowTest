/**
 * @flow
 *
 * The button used for header
 */

import React from 'react'
import Button from './Button';

import * as Theme from '../../theme';

export default (props) => {

  return (
    <Button
      containerStyle={{ backgroundColor: '#fff', paddingVertical: 0, paddingHorizontal: 10, margin:0, marginRight: 5, marginTop: 7, height: 25 }}
      textStyle={{ color: Theme.PRIMARY, fontSize: 13 }}
      { ...props }
    />
  )

}

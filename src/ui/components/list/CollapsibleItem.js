/**
 * @flow
 *
 * The ListItem component can be used to display an item in a list with text and optional icon.
 * The item can be clickable.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '../Button';
import Icon from '../Icon';
import * as Theme from '../../../theme';

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // An optional icon to display in the list item
  icon?: string,
  // An optional method that will be called on clicking the item
  onPress?: () => any,
  // The text to display in the list item
  item: Object,

  children: Node
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column'
  },
  header: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f3f3f3',
    paddingVertical: 7,
    height: 40,
    flex:1,
    flexDirection:'row',
    alignItems: 'center'
  },
  headerActive:{
    backgroundColor: Theme.SECONDARY,
    marginBottom:0
  },
  title: {
    color: '#000',
    fontWeight:'bold'
  },
  icon: {
    color: Theme.PRIMARY,
    fontSize: 24,
    marginRight: 16,
    textAlign: 'center',
    width: 30,
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f3f3f3'
  },
  contentActive: {
    marginBottom: 10
  },
  primaryIcon: {
    color: Theme.PRIMARY,
  },
  successIcon: {
    color: Theme.SUCCESS,
  },
  dangerIcon: {
    color: Theme.DANGER,
  },
  infoIcon: {
    color: Theme.INFO,
  },
  warningIcon: {
    color: Theme.WARNING,
  },
});

export default class CollapsibleItem extends React.Component<State, Props> {

  state = {
    isActive: false
  };

  toggleContent = () => {

    this.setState({
      'isActive': !this.state.isActive
    })

  }

  render() {

    const { icon, iconStyle, item, content } = this.props;
    const { isActive } = this.state

    return (

      <View style={styles.container}>

        <TouchableOpacity onPress={this.toggleContent}>

            <View style={[ styles.header, isActive && styles.headerActive ]}>

              <View style={{width: '80%'}}>
                <Text style={styles.title}>{ item.title }</Text>
              </View>

              <View style={{ width: '20%', flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>

                { icon ? (
                    <Icon active name={icon} style={[styles.icon, styles[(iconStyle || 'primary') + 'Icon' ]]} />
                ) : null }

              </View>

            </View>

        </TouchableOpacity>

        { isActive && (
          <View style={[ styles.content, isActive && styles.contentActive ]}>

            { content }

          </View>
        )}

      </View>
    )

  }

};

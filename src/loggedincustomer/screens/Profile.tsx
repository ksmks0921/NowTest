/**
 * @flow
 *
 * The Profile screen allows the user to view and manage all their linked accounts.
 */
import React from 'react'
import { Component } from 'react'
import { Image, StyleSheet, Text } from 'react-native'
import { NavigationScreenProp } from 'react-navigation/src/TypeDefinition'
import { connect } from 'react-redux'

import Icon from '../../ui/components/Icon'
import List from '../../ui/components/list/List'
import ListHeader from '../../ui/components/list/ListHeader'
import ListItem from '../../ui/components/list/ListItem'
import LogoutButton from '../../auth/core/components/LogoutButton'
import Screen from '../../ui/components/Screen'
import { hideLoading, showLoading } from '../../ui/redux/uiActions'
import { showError, showMessage, showWarning } from '../../ui/components/Toast'

import { User, UserRoles} from '../../util/user'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  nameText: {
    alignSelf: 'center',
    fontSize: 18,
  },
  photo: {
    alignSelf: 'center',
    borderRadius: 50,
    marginBottom: 8,
    marginTop: 16,
  },
  photoImage: {
    height: 100,
    width: 100,
  },
  photoIcon: {
    fontSize: 100,
    height: 100,
  },
  providersContainer: {
    alignSelf: 'stretch',
  },
})

/*
 * We use flow type to validate the Props of the component
 */
type Props = {
  // The redux dispatch function
  dispatch: (Object) => any,
  navigation: NavigationScreenProp
}

/*
 * We use flow type to validate the State of the component
 */
type State = {
  user: Object
}

class Profile extends Component<Props, State> {

  editEmailActionSheet: ActionSheet

  static navigationOptions = {
    headerRight: <LogoutButton/>,
    headerTitle: 'Profil',
  }

  constructor(props: Props, context: any) {

    super(props, context)

    // Set the default state of the component
    this.state = {
      user: global.user
    }
  }

  render() {
    const { user } = this.state

    // When the user logs out there may be a minor period where the Profile screen is
    // still displayed.  This protects against this scenario.
    if (!user) {
      return null
    }

    return (
      <Screen>
        {
          user.avatarUrl
          ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={[styles.photo, styles.photoImage]}
            />
          ) : (
            <Icon
              active
              name="md-person"
              style={[styles.photo, styles.photoIcon]}
            />
          )}

        <Text style={styles.nameText}>{user.firstName} {user.lastName}</Text>

        <List>

          <ListHeader text="Detalii" />

          <ListItem
            icon="md-person"
            text={ ['Rol:', user.role].join(' ') }
          />

        </List>

      </Screen>
    )
  }
}

// connect allows the component to communicate with redux
export default connect()(Profile)

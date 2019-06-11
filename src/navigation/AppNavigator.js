import React from 'react';
import { View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthStack from './AuthNavigator'
import MainStack from './MainNavigator'


import firebase from 'react-native-firebase';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // Listen for authentication state to change.
    
    // DEV MODE ONLY
    // firebase.auth().signOut()
    // AsyncStorage.removeItem('user')
    // AsyncStorage.removeItem('trialsRemaining')
    
    AsyncStorage.getItem('user').then(res => {
      this.props.navigation.navigate(JSON.parse(res) != null ? 'Main' : 'Auth' )
    })

  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator />
      </View>
    );
  }
}


export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainStack,
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
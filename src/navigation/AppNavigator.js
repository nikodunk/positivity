import React from 'react';
import { View, ActivityIndicator, AsyncStorage } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import AuthSwitch from './AuthNavigator'
import TrainerScreen from '../screens/TrainerScreen';


import firebase from 'react-native-firebase';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      user != null ? AsyncStorage.setItem('user', JSON.stringify(user)) : null
      this.props.navigation.navigate(user != null ? 'Main' : 'Auth' );
    });
    
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
  Main: TrainerScreen,
  AuthLoading: AuthLoadingScreen,
  Auth: AuthSwitch
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
import React from 'react';
import { Text, StyleSheet, View, KeyboardAvoidingView, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// https://docs.expo.io/versions/latest/guides/using-firebase/

import * as Animatable from 'react-native-animatable';
// import Button from 'react-native-button';

// var Mixpanel = require('react-native-mixpanel');
// Mixpanel = Mixpanel.default
// Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');

import firebase from 'react-native-firebase';

import { AccessToken, LoginManager } from 'react-native-fbsdk';

class AuthScreen extends React.Component {

  static navigationOptions = {
    title: 'Enable Notifications'
  };

  constructor(props) {
    super(props);
    this.state = { 
        loading: false,
        email: ''
       };
  }

  componentDidMount() {
      // Mixpanel.track("EmailScreen Loaded");
      AsyncStorage.getItem('email').then((res) => {
        email = res
        this.setState({email: email})
      })
  }

  _firebaseNotifSetup(){

    firebase.messaging().getToken()
    .then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        console.log('this is my FBCM token '+fcmToken)
        // this.props.putToken(this.state.phoneNo, fcmToken)
      } else {
        // user doesn't have a device token yet
      } 
    });

    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          console.log(enabled)
          this.props.navigation.navigate("AuthScreen3")
        } else {
          // user doesn't have permission
          firebase.messaging().requestPermission()
            .then(() => {
              // User has authorised  
              this.props.navigation.navigate("AuthScreen3")
            })
            .catch(error => {
              // User has rejected permissions
              this.props.navigation.navigate("AuthScreen3")
            })
        } 
      });

    //if there are any unread badgets, remove them.
    firebase.notifications().setBadge(0)

  }


  render() {
    return (

      <Animatable.View animation="fadeIn" duration={1000} style={{backgroundColor: '#fad168', padding: 20, flex: 1}}>
        <Text style={{fontSize: 20,textAlign: 'center'}}>Please allow push notifications so we can send you a daily reminder.</Text>
        <Text> </Text>
        <View style={styles.border}>
          <Button
            onPress={() => this._firebaseNotifSetup()}
            title="Allow daily reminder"
            />
        </View>
      </Animatable.View>

      );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  input:{
        height: 40, 
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
  bottomButton:{
        color: 'white',
        padding: 15,
        borderWidth: 0,
        overflow:'hidden',
        fontSize: 18,
        fontWeight: '600',
        height: 50, 
  },
  button:{
    padding: 8, 
    fontSize: 18, 
    fontWeight: '400',
  },
  border:{
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#2191fb', 
    overflow: 'hidden', 
    margin: 5, 
    marginTop: 0
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  }
})


export default AuthScreen;
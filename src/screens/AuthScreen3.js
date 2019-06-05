import React from 'react';
import { Text, StyleSheet, View, AsyncStorage, KeyboardAvoidingView, Button } from 'react-native';


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
    title: 'Get an Account'
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

  async facebookLogin() {

    try {
      const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);
  
      if (result.isCancelled) {
        // handle this however suites the flow of your app
        throw new Error('User cancelled request'); 
      }
  
      console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
  
      // get the access token
      const data = await AccessToken.getCurrentAccessToken();
  
      if (!data) {
        // handle this however suites the flow of your app
        throw new Error('Something went wrong obtaining the users access token');
      }
  
      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
  
      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
  
      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()))
    } catch (e) {
      console.error(e);
    }
  }


  render() {
    return (


      <Animatable.View animation="fadeIn" duration={1000} style={{backgroundColor: '#fad168', padding: 20, flex: 1}}>
        <Text>Finally, please sign up with Facebook so you can save your answers (nothing will be shared) and we can re-access your data if you lose your phone. We won't share your information or email you.</Text>
        <Text> </Text>
        <View style={styles.border}>
          <Button
            onPress={() => this.facebookLogin()}
            title="Login with Facebook"
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
  }
})


export default AuthScreen;
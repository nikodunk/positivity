import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator, KeyboardAvoidingView, Button } from 'react-native';
import { SafeAreaView } from 'react-navigation'

// https://docs.expo.io/versions/latest/guides/using-firebase/

// import * as Animatable from 'react-native-animatable';
// import Button from 'react-native-button';

// var Mixpanel = require('react-native-mixpanel');
// Mixpanel = Mixpanel.default
// Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');

import firebase from 'react-native-firebase';

import { AccessToken, LoginManager } from 'react-native-fbsdk';

class AuthScreen extends React.Component {

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
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        
        <View style={{ textAlign: 'center', alignItems: 'center', flex: 1, margin: 40}}>
      
          {/* <Animatable.View animation="fadeIn" duration={1000}>
            <Text style={{fontSize: 24, color: '#2191fb', textAlign: 'center'}}>
                Welcome! Please set your email to continue.
            </Text>
            <Text></Text>
          </Animatable.View> */}
          
          { this.state.loading ? 
            
            <ActivityIndicator style={{marginTop: 10}} color="black" />
            
            : 
            <KeyboardAvoidingView behavior="padding" enabled>
              <View style={styles.border}>
                <Button
                  onPress={() => this.facebookLogin()}
                  title="Login with Facebook"
                  />
              </View>


            </KeyboardAvoidingView>
          }
      
        </View>
      </View>
    </SafeAreaView>
      );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    margin: 10
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
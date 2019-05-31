import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, AsyncStorage, Button, SafeAreaView } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';

import Account from '../components/Account'

import firebase from 'react-native-firebase';

const d = new Date();
const today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay()

export default class TrainerScreen extends React.Component {

  static navigationOptions = {
    headerTransparent: true
  };

  constructor(props) {
    super(props);
    this.state = { 
        user: {},
        todaysPositivity: "",
        pastPositivity: null,
        saved: false
       };
    var timeout = null;
  }


  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(user =>  {
          userObject = JSON.parse(user)
          this.setState({user: userObject })
          // console.log(userObject.uid)
          firebase.database().ref('users/' + userObject.uid + '/').on('value', (snapshot) => {
            // console.log(snapshot.val());
            this._makePositivityStates(snapshot.val())
          });
    })

          // ------------- ** FIREBASE NOTIFICATION CODE ** -----

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
            } else {
              // user doesn't have permission
              setTimeout(() => {firebase.messaging().requestPermission()
                .then(() => {
                  // User has authorised  
                })
                .catch(error => {
                  // User has rejected permissions  
                })}, 3000)
            } 
          });


        //if there are any unread badgets, remove them.
        firebase.notifications().setBadge(0)


        // not sure if below two are necessary.
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
                // Process your notification as required
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            });
        
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            // console.log('notif received')
        });


        // ------------- ** END FIREBASE NOTIFICATION CODE ** -----
    
  }


  storePositivity(user, positivity) {
    // console.log(user.uid, positivity)
    this.setState({todaysPositivity: positivity})

    clearTimeout(this.timeout);

    // Make a new timeout set to go off in 800ms
    this.timeout = setTimeout(() => {
        if (user != null) {
          firebase.database().ref('users/' + user.uid + '/' + today ).set({
            positivity: positivity,
            created: today
          });
        }
        this.setState({saved: true})
        this.timeout = setTimeout(() => { this.setState({saved: false}) }, 1000)
    }, 1000);
    
  }


  _makePositivityStates(data){
    var pastPositivity = []
    var todaysPositivity = " "
    
    for (var key in data){
      key !== today ?
      
      // push past positivities to array
      pastPositivity.push({
        positivity: data[key].positivity,
        created: data[key].created
      }) 
      :
      // push today's positivitiy to string
      todaysPositivity = data[key].positivity
    }
    this.setState({pastPositivity: pastPositivity.reverse(), todaysPositivity: todaysPositivity  })
  }

  
  render() {

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={styles.container} behavior={"padding"} enabled>
            <Account user={this.state.user} />
            <ScrollView style={{flex: 1}} >


              <View style={styles.element}>
                <Text style={styles.center}>Hi, {this.state.user.displayName}! What are three things you're thankful for today?</Text>
                <Text></Text>
                <TextInput 
                  multiline={true}
                  value={this.state.todaysPositivity}
                  onChangeText={(text) => this.storePositivity(this.state.user, text)}
                  style={styles.textInput}
                  // autoFocus={true}
                  />
                {/* <Button title={'Save'} onPress={() => this.storePositivity(this.state.user, this.state.todaysPositivity)}/> */}
                {this.state.saved ? <Text>saved!</Text> : null }
              </View> 


              { this.state.data ?
                <View style={styles.element}>
                  <Text>....</Text>
                  <Text>Past things you've been thankful for:</Text>
                </View>
               : null }

              { this.state.pastPositivity ? 
                  this.state.pastPositivity.map((item, key) => 
                  <View style={styles.element} key={key}>
                    <Text>On {item.created}, you were thankful for:</Text>
                    <Text style={styles.center}>{item.positivity}</Text>
                  </View>
                  )
              : null }

            </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  element:{
    margin: 20,
    flex: 1,
    alignItems: 'center'
  },
  textInput:{
    borderWidth: 1,
    borderColor: 'lightgrey',
    width: '100%',
    height: 'auto',
    textAlign: 'center',
    borderRadius: 10
  },
  center: {
    textAlign: 'center'
  }
});
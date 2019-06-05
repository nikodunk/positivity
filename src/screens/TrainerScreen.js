import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, AsyncStorage, YellowBox, AppState, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
YellowBox.ignoreWarnings(['Warning: Async', 'Remote debugger']);
import * as Animatable from 'react-native-animatable';
import Purchases from 'react-native-purchases';


import Account from '../components/Account'

import firebase from 'react-native-firebase';

// this is the library of questions. add freely to them – how many there are doesn't matter!
const questions = [
  'What made you smile today?',
  'What are three things you\'re thankful for today?',
  'Name 2 things you\'re thankful for today!',
  'Please name 3 things you\'re thankful for today?',
  'What are 2 things you have today that you would never have dreamed of having 10 years ago?',
  'What good things have you achieved that your childhood self would have never believed?',
  'What\'s better about your life now that it was a decade ago?',
  'What are 2 things you admire about someone you dislike?',
  'Name 3 good things that happened to you today.',
  'What made you smile today?',
  'What are you doing excellently at in your life right now?',
  'What are you thankful for in a partner or a friend? Have you told them?'
]

export default class TrainerScreen extends React.Component {

  static navigationOptions = {
    headerTransparent: true
  };

  constructor(props) {
    super(props);
    this.state = { 
        user: {},
        todaysPositivity: '',
        todaysQuestion: '',
        pastPositivity: [],
        saved: false,
        appState: AppState.currentState,
        showPast: false
       };
    var timeout = null;
  }

  componentWillMount(){
    this.getUserAndSetupData()
  }

  componentDidMount(){
    firebase.analytics().logEvent('PositivityScreen_Loaded')
    AppState.addEventListener('change', this._handleAppStateChange);
    this._firebaseNotifSetup()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.getUserAndSetupData()
      //if there are any unread badgets, remove them.
      firebase.notifications().setBadge(0)
      this.setState({showPast: false})
    }
    this.setState({appState: nextAppState});
  }

  getUserAndSetupData() {
    AsyncStorage.getItem('user')
      .then(user =>  {
          userObject = JSON.parse(user)
          this.setState({user: userObject })
          // console.log(userObject.uid)
          Purchases.setDebugLogsEnabled(true);
          Purchases.setup("hyjasKNFjgNBbqSGJkYPqnxymzypYArR", userObject.uid);
          Purchases.getEntitlements().then(entitlements => console.log(entitlements))

          
          
          // GET THEIR DATA
          firebase.database().ref('users/' + userObject.uid + '/').on('value', (snapshot) => {
            
            // MAKE THE STATES
            this._makePositivityStates(snapshot.val())
          });
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
  }

  _getToday(){
    // make date in format 2019-05-31
    let d = new Date();
    let today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    return today
  }


  _makePositivityStates(data){
    let pastPositivity = []
    let todaysPositivity = ''
    let todaysQuestion = ''
    let today = this._getToday()

    for (var key in data){
      if (key === today) {
        // if the item is today's positivity – push it to string
        todaysPositivity = data[key].positivity
        todaysQuestion = data[key].question
      } else {
        // else push it to past positivities array
        pastPositivity.push({
          positivity: data[key].positivity,
          created: data[key].created,
          question: data[key].question
        }) 
      }
    }

    // if there's no active question even after checked the server (ie. today is still blank), create a question for today and save it to server.
    if (todaysQuestion === ''){ 
      todaysQuestion = this.getRandomQuestion()
      // save the qeustion to the server so that it doesn't change any more today
      firebase.database().ref('users/' + this.state.user.uid + '/' + today ).set({
        question: todaysQuestion
      });
    }

    // save all to state
    this.setState({
        pastPositivity: pastPositivity.reverse(),
        todaysPositivity: todaysPositivity, 
        todaysQuestion: todaysQuestion  
      })

  }

  getRandomQuestion(){
    //make a random number between one and the length of the items in the question array
    randomNumber = Math.floor(Math.random() * questions.length)
    return questions[randomNumber]
  }

  storePositivity() {
    // console.log(user.uid, text)
    let today = this._getToday()

    this.setState({saving: true, saved: false})

    firebase.database().ref('users/' + this.state.user.uid + '/' + today ).set({
      positivity: this.state.todaysPositivity,
      created: today,
      question: this.state.todaysQuestion
    });

    this.setState({ saving: false, saved: true})
    this.timeout = setTimeout(() => { this.setState({saved: false}) }, 1000)

    
  }

  _getBackgroundColor(){
    const colors = [
      '#abcdef', '#bedcaf', '#cafedb', '#decafb'
    ]
    const randomNumber = Math.floor(Math.random() * colors.length)
    return colors[randomNumber]
  }

  render() {

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior={"padding"} enabled>
          <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={'handled'}>

            <Animatable.View duration={1000} transition="opacity" style={{opacity: this.state.showPast ? 1 : 0 }}>
              <Account user={this.state.user} visible={this.state.showPast} />
            </Animatable.View>

              <View style={{ backgroundColor: this.state.backgroundColor, padding: 30}} >
                <Text style={styles.center}>👇 Today's question</Text>
                <Text style={styles.question}>
                  {this.state.todaysQuestion}
                </Text>
                <Text></Text>
                
                <Animatable.View
                  animation="fadeIn"
                  delay={3000} 
                  duration={1000}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>🙂 Your answer – tap below to type.</Text>
                    {this.state.saved ? <Text style={{}}>Saved ✅</Text> : <Text> </Text> }
                    {this.state.saving ? <ActivityIndicator /> : null }
                  </View>
                  <TextInput 
                    multiline={true}
                    value={this.state.todaysPositivity}
                    placeholder={'Answer here...'}
                    onChangeText={(text) => this.setState({todaysPositivity: text})}
                    style={ styles.textInput }
                    />
                  <Button
                    onPress={() => this.storePositivity()}
                    title="Save" />
                </Animatable.View>
                <View>
                </View>
                
              </View> 

              <Animatable.View style={styles.accountBar} animation="fadeIn" delay={5000} duration={3000}>
                
                {this.state.showPast ? 
                <View>
                  <Text style={{paddingTop: 30, padding: 10}}>
                    Past positivities
                  </Text>
              
                  { this.state.pastPositivity.length > 0 ? 
                      this.state.pastPositivity.map((item, key) => 
                      <Animatable.View
                        animation="slideInLeft" 
                        duration={1000-(key*300)}
                        style={{ backgroundColor: this._getBackgroundColor(), padding: 30, borderBottomWidth: 1, borderBottomColor: 'grey' }} key={key}
                        >
                          <Text style={{}}>
                            {item.question}
                          </Text>
                          <Text style={styles.question}>
                            {item.positivity}
                          </Text>
                      </Animatable.View>
                      )
                    : null }
                </View> :
                <View style={{marginTop: 30}}>
                  <Button onPress={() => this.setState({showPast: true})} title="See everything you've been thankful for" />
                </View>
                }

              </ Animatable.View>

            </ScrollView>
        </KeyboardAvoidingView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  element:{
    margin: 20
  },
  textInput:{
    width: '100%',
    height: 'auto',
    padding: 20,
    marginTop: 5,
    fontSize: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  question: {
    fontSize: 30
  },
  positivity: {
    width: '100%',
    height: 'auto',
    padding: 20,
    marginTop: 5,
    fontSize: 20
  }
});
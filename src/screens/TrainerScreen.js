import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, AsyncStorage, SafeAreaView, YellowBox, AppState, ActivityIndicator } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
YellowBox.ignoreWarnings(['Warning: Async', 'Remote debugger']);

import Account from '../components/Account'

import firebase from 'react-native-firebase';

// make date in format 2019-05-31
const d = new Date();
const today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()

// this is the library of questions. add freely to them – how many there are doesn't matter!
const questions = [
  'What made you smile today?',
  'What are three things you\'re thankful for today?',
  'What are 2 things you have today that you would never have dreamed of having 10 years ago?',
  'What good things have you achieved that your childhood self would have never believed?',
  'What\'s better about your life now that it was a decade ago?',
  'What\'s 2 things you admire about someone you dislike?',
  'Name 3 good things that happened to you today.',
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
        appState: AppState.currentState
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
    }
    this.setState({appState: nextAppState});
  }

  getUserAndSetupData() {
    AsyncStorage.getItem('user')
      .then(user =>  {
          userObject = JSON.parse(user)
          this.setState({user: userObject })
          // console.log(userObject.uid)
          
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


  _makePositivityStates(data){
    var pastPositivity = []
    var todaysPositivity = ''
    var todaysQuestion = ''
    
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

  storePositivity(text) {
    // console.log(user.uid, text)
    this.setState({todaysPositivity: text, saving: false, saved: false})

    clearTimeout(this.timeout);

    // Make a new timeout set to go off in 2000ms
    this.timeout = setTimeout(() => {
        this.setState({saving: true, saved: false})
        if (this.state.user != null) {
          firebase.database().ref('users/' + this.state.user.uid + '/' + today ).set({
            positivity: this.state.todaysPositivity,
            created: today,
            question: this.state.todaysQuestion
          });
        }
        this.setState({saving: false, saved: true})
        this.timeout = setTimeout(() => { this.setState({saved: false}) }, 1000)
    }, 2000);
    
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
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={styles.container} behavior={"padding"} enabled>
            <Account user={this.state.user} />
            <ScrollView style={{flex: 1}} >


              <View style={styles.element}>
                <Text style={styles.center}>Hi, {this.state.user.displayName}! Today's question is</Text>
                <Text></Text>

                <Text style={styles.question}>
                  {this.state.todaysQuestion}
                </Text>
                <Text></Text>
                <Text>Your answer</Text>
                  
                <TextInput 
                  multiline={true}
                  value={this.state.todaysPositivity}
                  placeholder={'Answer here...'}
                  onChangeText={(text) => this.storePositivity(text)}
                  style={[ styles.textInput, { backgroundColor: this._getBackgroundColor()} ]}
                  />
                <View>
                    {this.state.saved ? <Text style={{color: 'green'}}>Saved!</Text> : <Text> </Text> }
                    {this.state.saving ? <ActivityIndicator /> : null }
                </View>
                
              </View> 


              { this.state.pastPositivity.length > 0 ?
                <View style={styles.element}>
                  <Text>Past positivities</Text>
                </View>
               : null }

              { this.state.pastPositivity.length > 0 ? 
                  this.state.pastPositivity.map((item, key) => 
                  <View style={styles.element} key={key}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Text style={[styles.positivity, { backgroundColor: this._getBackgroundColor()} ]}>{item.positivity}</Text>
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
    margin: 20
  },
  textInput:{
    borderColor: 'grey',
    borderWidth: 5,
    borderRadius: 10,
    backgroundColor: '#decafb',
    width: '100%',
    height: 'auto',
    padding: 20,
    marginTop: 5,
    fontSize: 20
  },
  question: {
    fontSize: 30
  },
  positivity: {
    width: '100%',
    height: 'auto',
    borderRadius: 10,
    padding: 20,
    marginTop: 5,
    fontSize: 20
  }
});
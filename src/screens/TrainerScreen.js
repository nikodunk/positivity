import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, YellowBox, AppState, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
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

const emojiArray = ['🙂', '😁', '😃', '😀','😄']

export default class TrainerScreen extends React.Component {

  static navigationOptions = {
    header: null,
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
        showPast: false,
        trialsRemaining: null,
        subscribed: null
       };
    var timeout = null;
  }

  componentWillMount(){
    this.getUserAndSetupData()
    firebase.analytics().logEvent('PositivityScreen_Loaded')
    this._firebaseNotifSetup()
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.getUserAndSetupData()
      //if there are any unread badges, remove them.
      firebase.notifications().setBadge(0)
      this.setState({showPast: false})
    }
    this.setState({appState: nextAppState});
  }
  
  getUserAndSetupData() {
    this.setState({
      todaysQuestion: this.getRandomQuestion()
    })
    AsyncStorage.getItem('saves').then(res => {
      this._makePositivityStates(JSON.parse(res))
    })
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

    // if today's question exists, save it immediately so view can update
    this.setState({todaysQuestion: todaysQuestion})

    // if there's no active question even after checking the server (ie. today is still blank), create a question for today and save it to server.
    if (todaysQuestion === ''){ 
      todaysQuestion = this.getRandomQuestion()

      // save today's question immediately so view can update before saving it to server
      this.setState({todaysQuestion: todaysQuestion})

      // save the question to the server so that it doesn't change any more today
      firebase.database().ref('users/' + this.state.user.uid + '/' + today ).set({
        question: todaysQuestion
      });
    }

    // save answers to state
    this.setState({
        pastPositivity: pastPositivity.reverse(),
        todaysPositivity: todaysPositivity
      })

  }

  storePositivity() {
    console.log('trialsRemaining: ', this.state.trialsRemaining, ' subscribed: ', this.state.subscribed)
    if(this.state.user === 'trial') {
        this.props.navigation.navigate('AuthScreen3')
    }
    else if(this.state.trialsRemaining < 1 && this.state.subscribed !== true ) {
      this.props.navigation.navigate('PurchaseScreen')
    }
    else {
      let today = this._getToday()
      this.setState({saving: true, saved: false})

      firebase.database().ref('users/' + this.state.user.uid + '/' + today ).set({
        positivity: this.state.todaysPositivity,
        created: today,
        question: this.state.todaysQuestion
      });
      firebase.analytics().logEvent('Save_Pressed')
      this.setState({ saving: false, saved: true})
      this.timeout = setTimeout(() => { this.setState({saved: false}) }, 1000)
      AsyncStorage.setItem('trialsRemaining', JSON.stringify(this.state.trialsRemaining - 1))
      this.setState({trialsRemaining: this.state.trialsRemaining - 1 })
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior={"padding"} enabled>
          <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={'handled'}>
              
              <Animatable.View duration={1000} transition="opacity" style={{opacity: this.state.showPast ? 1 : 0 }}>
                <Account user={this.state.user} visible={this.state.showPast} logout={() => this.logout()} />
              </Animatable.View> 

              <View style={{ backgroundColor: this.state.backgroundColor, padding: 30}} >
                <Animatable.Text animation="bounceIn" easing="ease-out" style={styles.center}>
                  👇 Today's question
                </Animatable.Text>
                <Animatable.Text animation="bounceIn" easing="ease-out" style={styles.question}>
                  {this.state.todaysQuestion}
                </Animatable.Text>
                <Text></Text>
                
                <Animatable.View
                  animation="bounceIn"
                  delay={3000}>
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
                  <View style={{marginTop: 30}}>
                    <Button onPress={() => this.pastToggle()} title="Hide Past Positivities" />
                  </View>
                  <Text style={{paddingTop: 30, padding: 10}}>
                    Past positivities
                  </Text>
              
                  { this.state.pastPositivity.length > 0 ? 
                      this.state.pastPositivity.map((item, key) => 
                      <Animatable.View
                        animation="slideInLeft" 
                        duration={1000-(key*600)}
                        style={{ backgroundColor: this._getBackgroundColor(), padding: 30, borderBottomWidth: 1, borderBottomColor: 'grey' }} key={key}
                        >
                          <Text>
                            {this.getRandomEmoji()} {item.question}
                          </Text>
                          <Text style={styles.question}>
                            {item.positivity}
                          </Text>
                      </Animatable.View>
                      )
                    : null }
                </View> :
                <View style={{marginTop: 30}}>
                  <Button onPress={() => this.pastToggle()} title="Show Past Positivities" />
                </View>
                }

              </ Animatable.View>

            </ScrollView>
        </KeyboardAvoidingView>
    </View>
    );
  }

  _getToday(){
    // make date in format 2019-05-31
    let d = new Date();
    let today = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    return today
  }

  getRandomQuestion(){
    //make a random number between one and the length of the items in the question array
    randomNumber = Math.floor(Math.random() * questions.length)
    return questions[randomNumber]
  }

  _getBackgroundColor(){
    const colors = [
      '#abcdef', '#bedcaf', '#cafedb', '#decafb'
    ]
    const randomNumber = Math.floor(Math.random() * colors.length)
    return colors[randomNumber]
  }

  pastToggle(){
    if(this.state.user === 'trial'){
      this.props.navigation.navigate('AuthScreen3')
    } else {
      this.setState({showPast: !this.state.showPast})
    }
  }

  getRandomEmoji(){
    randomNumber = Math.floor(Math.random() * 5)
    return emojiArray[randomNumber]
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
          setTimeout(() => {
            firebase.messaging().requestPermission()
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

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fad168'
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
    fontSize: 30,
    fontWeight: '600'
  },
  positivity: {
    width: '100%',
    height: 'auto',
    padding: 20,
    marginTop: 5,
    fontSize: 20
  }
});
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, AsyncStorage, Button, SafeAreaView } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';

import Account from '../components/Account'

import firebase from 'react-native-firebase';


export default class TrainerScreen extends React.Component {
  static navigationOptions = {
    headerTransparent: true
  };

  constructor(props) {
    super(props);
    this.state = { 
        user: {},
        todaysPositivity: "",
        pastPositivity: null
       };
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
  }


  storePositivity(user, positivity) {
    // console.log(user.uid, positivity)
    var d = new Date();
    today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay()
    if (user != null) {
      firebase.database().ref('users/' + user.uid + '/' + today ).set({
        positivity: positivity,
        created: today
      });
    }
  }

  _makePositivityStates(data){
    var pastPositivity = []
    var todaysPositivity = " "
    
    // work out what day it is
    var d = new Date();
    today = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDay()

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

              { this.state.todaysPositivity ? 
                <View style={styles.element}>
                  <Text style={styles.center}>Hi, {this.state.user.displayName}! What are three things you're thankful for today?</Text>
                  <Text></Text>
                  <TextInput 
                    multiline={true}
                    value={this.state.todaysPositivity}
                    onChangeText={(text) => this.setState({todaysPositivity: text})}
                    style={styles.textInput}
                    // autoFocus={true}
                    />
                  <Button title={'Save'} onPress={() => this.storePositivity(this.state.user, this.state.todaysPositivity)}/>
                </View> 
              : null }

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
    padding: 20,
    borderRadius: 10
  },
  center: {
    textAlign: 'center'
  }
});

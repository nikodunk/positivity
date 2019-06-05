import React from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import firebase from 'react-native-firebase';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);
    this.state = { 
       };
  }

  logout(){
    Alert.alert(
      'Are you sure you want to log out?',
      'All your positivities are saved',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Logout', onPress: () => firebase.auth().signOut()},
      ],
      {cancelable: false},
    ); 
  }

  componentWillMount(){
    
  }

  render() {
    return (
      <View style={styles.accountBar} >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Image source={{uri: this.props.user.photoURL }} style={styles.image} />
            <Text style={styles.title}>My Positivity</Text>
          </View>
          <View style={{paddingTop: 5}}>
            <Button
              title="Logout"
              onPress={() => this.logout()}
            />
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: 30, 
    height: 30,
    borderRadius: 15,
    marginRight: 5
  },
  title: {
    fontSize: 20,
    paddingTop: 2
  },
  accountBar: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingLeft: 10, 
    paddingRight: 10, 
    marginTop: 32,
    marginBottom: 8,
    alignItems: 'flex-end',
  }
});
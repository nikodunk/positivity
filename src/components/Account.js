import React from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor(props) {
    super(props);
    this.state = { 
       };
  }


  render() {
    return (
      <View style={styles.accountBar} >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Text style={styles.title}></Text>
          </View>
          <View style={{paddingTop: 5}}>
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
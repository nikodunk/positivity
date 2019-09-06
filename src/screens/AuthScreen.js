import React from 'react';
import { ScrollView, StyleSheet, View, Text, Button } from 'react-native';

// https://docs.expo.io/versions/latest/guides/using-firebase/

import * as Animatable from 'react-native-animatable';

// var Mixpanel = require('react-native-mixpanel');
// Mixpanel = Mixpanel.default
// Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');


export default class AuthScreen extends React.Component {

  static navigationOptions = {
    title: 'Welcome to Positivity Trainer!'
  };


  render() {
    return (

      <Animatable.View 
        animation="fadeIn" 
        duration={1000} 
        style={styles.container}>
        <ScrollView style={{flex: 1}}>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>This app asks you a different question every day, designed to focus on the positive in life!</Text>
            <Text style={styles.text}> </Text>
            <Animatable.Text 
              animation="fadeIn" 
              duration={1000} 
              delay={2000}
              style={styles.question}>
                What made you smile today?
            </Animatable.Text>
            <Text style={styles.text}> </Text>
            <Animatable.View
              animation="fadeIn" 
              duration={1000} 
              delay={3000}>
              <Text style={styles.text}>Is a good example. To do this, we'll send you a reminder 1x per day. To allow this, please accept notifications.</Text>
              <Text style={styles.text}> </Text>
              <View style={styles.border}>
                <Button 
                  title="Next"
                  onPress={() => this.props.navigation.navigate('AuthScreen2')}
                  />
              </View>
            </Animatable.View>
        </ScrollView>
      </Animatable.View>

      );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fad168', 
    padding: 20, 
    flex: 1
  },
  question: {
    fontSize: 30,
    fontWeight: '600'
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
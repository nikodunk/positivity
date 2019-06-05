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
            <Text style={styles.text}>Sometimes, it feels like the news, our society, our times focus too much on the negative.</Text>
            <Text style={styles.text}>Yet so many good things are also happening in the world.</Text>
            <Text style={styles.text}>It's been proven that looking for the positive in life can make us find more of it and make us happier.</Text>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>This app will ask you a question like below every day, designed to help you remember the positive parts of your life and make you feel better about yourself:</Text>
            <Text style={styles.text}> </Text>
            <Animatable.Text 
              animation="fadeIn" 
              duration={1000} 
              delay={1000}
              style={styles.question}>
                What thing made you smile today?
            </Animatable.Text>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>To do this, we'll need Notifications and Facebook permissions (and we'll explain why on the next screen)</Text>
            <Text style={styles.text}> </Text>
          <View style={styles.border}>
            <Button 
              title="Next"
              onPress={() => this.props.navigation.navigate('AuthScreen2')}
              />
          </View>
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
    fontSize: 30
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
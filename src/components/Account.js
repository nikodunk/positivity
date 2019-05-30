import React from 'react';
import { View, Button, Image } from 'react-native';

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
    firebase.auth().signOut()
  }

  componentDidMount(){
    
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderWidth: 1}}>
        <Button
          title="Logout"
          onPress={() => this.logout()}
         />
         <Image source={{uri: this.props.user.photoURL }} style={{width: 50, height: 50}} />
    </View>
    )
  }
}
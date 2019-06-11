import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView, ScrollView } from 'react-native';


import * as Animatable from 'react-native-animatable';
import Purchases from 'react-native-purchases';
import firebase from 'react-native-firebase';


class AuthScreen extends React.Component {

  static navigationOptions = {
    title: 'Purchase Positivity Pro'
  };

  constructor(props) {
    super(props);
    this.state = { 

       };
  }

  componentDidMount() {
    firebase.analytics().logEvent('PurchaseScreen_Loaded')
  }

  async purchasePositivity(){
    try {
      const purchaseMade = await Purchases.makePurchase("com.bigset.positivity.monthly");
      if (purchaseMade.purchaserInfo.activeEntitlements !== "undefined" &&
          purchaseMade.purchaserInfo.activeEntitlements.includes("monthly")) {
          firebase.analytics().logEvent('Subscribed_Successfully')
          this.props.navigation.navigate('TrainerScreen')
      }
    } catch (e) {
      console.log(e);
    }
  }

  async restorePositivity(){
    
    try {
      const purchaserInfo = await Purchases.getPurchaserInfo();
      // Check if user has active subscription (from App Store Connect or Play Store)
      if (purchaserInfo.activeSubscriptions !== "undefined" && purchaserInfo.activeSubscriptions.includes("com.bigset.positivity.monthly")) {
        // Grant user "pro" access
        console.log('subscribed: true!')
        this.props.navigation.navigate('TrainerScreen')
      }
      else {
        console.log('subscribed: false!')
        this.props.navigation.navigate('TrainerScreen')
      }
    } catch (e) {
     // Error fetching purchaser info
    }
  }

  
  render() {
    return (


      <Animatable.View animation="fadeIn" duration={1000} style={{backgroundColor: '#fad168', padding: 20, flex: 1}}>
        {!this.state.loading ? 
        <View style={{flex: 1}}>
          <Text>Support development of this app for $1 a week!</Text>
          <Text> </Text>
          <ScrollView style={{ margin: 5, borderWidth: 1, borderColor: 'lightgrey', padding: 5}}>
                        <Text style={{fontSize: 12, color: 'grey'}}>
                            • Payment will be charged to iTunes Account at confirmation of purchase {'\n'}
                            • Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period {'\n'}
                            • Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal{'\n'}
                            • Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase{'\n'}
                            • Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable{'\n'}
                            • By using this software you agree to receiving the occasional feedback or marketing email to help us improve the product for you.{'\n'}
                        </Text>
                        <Text style={{fontSize: 12, color: '#2191fb'}}
                              onPress={() => Linking.openURL('http://soapdictate.com/terms/')}>
                          • Terms of Service{'\n'}
                        </Text>
                        <Text style={{fontSize: 12, color: '#2191fb'}}
                              onPress={() => Linking.openURL('http://soapdictate.com/privacy/')}>
                          • Privacy Policy{'\n'}
                        </Text>
          </ScrollView>

          <View style={styles.border}>
            <Button 
              onPress={() => this.purchasePositivity()}
              title="Start free trial, then $3.99/month" />
          </View>

          <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#2191fb', overflow: 'hidden', margin: 5, marginTop: 0}}>
            <Button
              onPress={() => this.restorePositivity()}
              title="or restore purchase" />
          </View>

        </View>
        : <ActivityIndicator /> }
      </Animatable.View>




      );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fad168'
  },
  input:{
        height: 40, 
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
  bottomButton:{
        color: 'white',
        padding: 15,
        borderWidth: 0,
        overflow:'hidden',
        fontSize: 18,
        fontWeight: '600',
        height: 50, 
  },
  button:{
    padding: 8, 
    fontSize: 18, 
    fontWeight: '400',
  },
  border:{
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#2191fb', 
    overflow: 'hidden', 
    margin: 5, 
    marginTop: 0
  }
})


export default AuthScreen;
import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button, ScrollView, Linking, TouchableOpacity } from 'react-native';


import * as Animatable from 'react-native-animatable';
import Purchases from 'react-native-purchases';
import firebase from 'react-native-firebase';


class AuthScreen extends React.Component {

  static navigationOptions = {
    title: 'Continue'
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
          <Text style={{fontSize: 30, fontWeight: '600', textAlign: 'center'}}>Feeling more positive already?</Text>
          <Text style={{fontSize: 20, textAlign: 'center'}}>Continue building positivity for $1.49/month – less than a ☕️. Try a 3-day free trial, then $1.49/month after that. Cancel any time. </Text>
          {/* <Text style={{fontSize: 15}}>We know... it's rough, but it costs money to keep software up to date and online. But look on the bright side – it doesn't cost you much at all to spread positivity if everyone chips in! 🍀 Thank you!</Text> */}
          <Text> </Text>
          <ScrollView style={{ borderWidth: 1, borderColor: 'grey', padding: 5, borderRadius: 10}}>
                        <Text style={{fontSize: 12, color: 'grey'}}>
                            • Payment will be charged to iTunes Account at confirmation of purchase {'\n'}
                            • Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period {'\n'}
                            • Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal{'\n'}
                            • Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase{'\n'}
                            • Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable{'\n'}
                            • By using this software you agree to receiving the occasional feedback or marketing email to help us improve the product for you.{'\n'}
                        </Text>
                        <Text style={{fontSize: 12, color: '#2191fb'}}
                              onPress={() => Linking.openURL('http://sunboxlabs.com/terms/')}>
                          • Terms of Service{'\n'}
                        </Text>
                        <Text style={{fontSize: 12, color: '#2191fb'}}
                              onPress={() => Linking.openURL('http://sunboxlabs.com/privacy/')}>
                          • Privacy Policy{'\n'}
                        </Text>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={() => this.purchasePositivity()}>
            <Text style={styles.bottomButton}>
              Start 3-Day Free Trial, then $1.49/month
            </Text>
          </TouchableOpacity>

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
  bottomButton:{
    color: 'white',
    padding: 15,
    borderWidth: 0,
    overflow:'hidden',
    fontSize: 18,
    fontWeight: '600',
    height: 50, 
    textAlign: 'center'
  },
  button:{
    borderRadius: 10, 
    backgroundColor: '#2191fb', 
    margin: 5
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
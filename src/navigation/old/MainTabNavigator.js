import React from 'react';
import { Platform, View, ActivityIndicator, AsyncStorage } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import TrainerScreen from '../screens/TrainerScreen';





const TrainerStack = createStackNavigator({
  Links: TrainerScreen,
});

TrainerStack.navigationOptions = {
  tabBarLabel: 'Trainer',
  tabBarIcon: ({ focused }) => (
    <Icon name="ios-paper" size={20} color="grey"  />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <Icon name="ios-paper" size={20} color="grey"  />
  ),
};




export default AppTabs = createBottomTabNavigator({
  TrainerStack,
  SettingsStack,
});
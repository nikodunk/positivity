import { createStackNavigator } from 'react-navigation';

import TrainerScreen from '../screens/TrainerScreen';
import AuthScreen3 from '../screens/AuthScreen3';
import PurchaseScreen from '../screens/PurchaseScreen';


export default AppStack = createStackNavigator({ TrainerScreen: TrainerScreen, AuthScreen3: AuthScreen3, PurchaseScreen: PurchaseScreen });
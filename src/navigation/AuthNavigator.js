import { createStackNavigator } from 'react-navigation';

import AuthScreen from '../screens/AuthScreen';
import AuthScreen2 from '../screens/AuthScreen2';


export default AuthSwitch = createStackNavigator({ AuthScreen: AuthScreen, AuthScreen2: AuthScreen2 });
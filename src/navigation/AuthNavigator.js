import { createStackNavigator } from 'react-navigation';

import AuthScreen from '../screens/AuthScreen';
import AuthScreen2 from '../screens/AuthScreen2';
import AuthScreen3 from '../screens/AuthScreen3';


export default AuthSwitch = createStackNavigator({ AuthScreen: AuthScreen, AuthScreen2: AuthScreen2, AuthScreen3: AuthScreen3 });
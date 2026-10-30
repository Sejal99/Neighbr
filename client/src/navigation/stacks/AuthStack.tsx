import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../views/screens/auth/LoginScreen';
import RegisterScreen from '../../views/screens/auth/RegisterScreen';
import type {AuthStackParamList} from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;

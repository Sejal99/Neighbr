import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {useAuth} from '../auth/AuthContext';
import {colors} from '../theme';
import SessionLoadingScreen from '../views/screens/auth/SessionLoadingScreen';
import AuthStack from './stacks/AuthStack';
import MainTabs from './tabs/MainTabs';

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brand,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    notification: colors.error,
  },
};

const RootNavigator = () => {
  const {status} = useAuth();

  if (status === 'restoring') {
    return <SessionLoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {status === 'authenticated' ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;

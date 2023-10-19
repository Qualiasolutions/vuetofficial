import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { UnauthorisedTabParamList } from '../types/base';
import LoginScreen from 'screens/AuthScreens/LoginScreen';
import SignupScreen from 'screens/AuthScreens/SignupScreen';
import ValidatePhoneScreen from 'screens/AuthScreens/ValidatePhoneScreen';
import CreatePasswordScreen from 'screens/AuthScreens/CreatePasswordScreen';
import ForgotPasswordScreen from 'screens/AuthScreens/ForgotPasswordScreen';
import { useThemeColor } from 'components/Themed';
import { AlmostWhiteBackOnlyHeaderWithSafeArea } from 'headers/BackOnlyHeader';

const UnauthorisedStack =
  createNativeStackNavigator<UnauthorisedTabParamList>();

export function UnauthorisedNavigator() {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <UnauthorisedStack.Navigator
      screenOptions={{
        header: AlmostWhiteBackOnlyHeaderWithSafeArea
      }}
    >
      <UnauthorisedStack.Screen name="Login" component={LoginScreen} />
      <UnauthorisedStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <UnauthorisedStack.Screen name="Signup" component={SignupScreen} />
      <UnauthorisedStack.Screen
        name="ValidatePhone"
        component={ValidatePhoneScreen}
      />
      <UnauthorisedStack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
      />
    </UnauthorisedStack.Navigator>
  );
}

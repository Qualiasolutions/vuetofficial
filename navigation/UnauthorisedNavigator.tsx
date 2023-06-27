import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { UnauthorisedTabParamList } from '../types/base';
import LoginScreen from 'screens/AuthScreens/LoginScreen';
import SignupScreen from 'screens/AuthScreens/SignupScreen';
import ValidatePhoneScreen from 'screens/AuthScreens/ValidatePhoneScreen';
import CreatePasswordScreen from 'screens/AuthScreens/CreatePasswordScreen';
import ForgotPasswordScreen from 'screens/AuthScreens/ForgotPasswordScreen';

const UnauthorisedStack =
  createNativeStackNavigator<UnauthorisedTabParamList>();

export function UnauthorisedNavigator() {
  return (
    <UnauthorisedStack.Navigator>
      <UnauthorisedStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="ValidatePhone"
        component={ValidatePhoneScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
        options={{ headerShown: false }}
      />
    </UnauthorisedStack.Navigator>
  );
}

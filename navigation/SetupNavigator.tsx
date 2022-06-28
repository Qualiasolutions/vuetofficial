import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { SetupTabParamList } from '../types/base';
import CreateAccountScreen from 'screens/SetUpScreens/CreateAccountScreen';
import AddFamilyScreen from 'screens/SetUpScreens/AddFamilyScreen';
import WelcomeToVuetScreen from 'screens/SetUpScreens/WelcomeToVuetScreen';

const SetupStack = createNativeStackNavigator<SetupTabParamList>();

export function SetupNavigator() {
  return (
    <SetupStack.Navigator>
      <SetupStack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ headerShown: false }}
      />
      <SetupStack.Screen
        name="AddFamily"
        component={AddFamilyScreen}
        options={{ headerShown: false }}
      />
      <SetupStack.Screen
        name="WelcomeToVuet"
        component={WelcomeToVuetScreen}
        options={{ headerShown: false }}
      />
    </SetupStack.Navigator>
  );
}

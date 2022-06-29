import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { SetupTabParamList } from '../types/base';
import CreateAccountScreen from 'screens/SetUpScreens/CreateAccountScreen';
import AddFamilyScreen from 'screens/SetUpScreens/AddFamilyScreen';
import WelcomeToVuetScreen from 'screens/SetUpScreens/WelcomeToVuetScreen';
import AddFamilyMemberScreen from 'screens/SetUpScreens/AddFamilyMemberScreen';
import FamilyRequestScreen from 'screens/SetUpScreens/FamilyRequestScreen';

const SetupStack = createNativeStackNavigator<SetupTabParamList>();

export function SetupNavigator() {
  return (
    <SetupStack.Navigator>
      <SetupStack.Screen
        name="FamilyRequest"
        component={FamilyRequestScreen}
        options={{ headerShown: false }}
      />
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
        name="AddFamilyMember"
        component={AddFamilyMemberScreen}
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

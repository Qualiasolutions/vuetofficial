import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { SetupTabParamList } from '../types/base';
import CreateAccountScreen from 'screens/SetUpScreens/CreateAccountScreen';
import AddFamilyScreen from 'screens/SetUpScreens/AddFamilyScreen';
import WelcomeToVuetScreen from 'screens/SetUpScreens/WelcomeToVuetScreen';
import AddFamilyMemberScreen from 'screens/SetUpScreens/AddFamilyMemberScreen';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';

const SetupStack = createNativeStackNavigator<SetupTabParamList>();

export function SetupNavigator() {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      skip: !userDetails?.user_id
    }
  );

  let initialRouteName = 'CreateAccount' as keyof SetupTabParamList;

  if (
    userFullDetails?.member_colour &&
    userFullDetails?.first_name &&
    userFullDetails?.last_name &&
    userFullDetails?.dob
  ) {
    initialRouteName = 'AddFamily';
  }

  return (
    <SetupStack.Navigator initialRouteName={initialRouteName}>
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

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { SettingsTabParamList } from '../types/base';
import SettingsScreen from 'screens/SettingsScreens/SettingsScreen';
import FamilySettingsScreen from 'screens/SettingsScreens/FamilySettingsScreen';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from 'components/Themed';
import CreateUserInviteScreen from 'screens/SettingsScreens/Forms/CreateUserInviteScreen';
import EditFamilyMemberScreen from 'screens/SettingsScreens/Forms/EditFamilyMemberScreen';
import EditFamilyInviteScreen from 'screens/SettingsScreens/Forms/EditFamilyInviteScreen';
import FriendSettingsScreen from 'screens/SettingsScreens/FriendsSettingsScreen';
import BackOnlyHeader from 'headers/BackOnlyHeader';

const SettingsStack = createNativeStackNavigator<SettingsTabParamList>();

export function SettingsNavigator() {
  const { t } = useTranslation();
  const headerTintColor = useThemeColor({}, 'primary');

  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        header: BackOnlyHeader,
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('pageTitles.settings'),
          headerTintColor,
          headerShown: false
        }}
      />
      <SettingsStack.Screen
        name="FamilySettings"
        component={FamilySettingsScreen}
        options={{
          title: t('pageTitles.familySettings'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="FriendSettings"
        component={FriendSettingsScreen}
        options={{
          title: t('pageTitles.friendSettings'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="CreateUserInvite"
        component={CreateUserInviteScreen}
        options={{
          title: t('pageTitles.addFamilyMember'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="EditFamilyMember"
        component={EditFamilyMemberScreen}
        options={{
          title: '',
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="EditFamilyInvite"
        component={EditFamilyInviteScreen}
        options={{
          title: '',
          headerTintColor
        }}
      />
    </SettingsStack.Navigator>
  );
}

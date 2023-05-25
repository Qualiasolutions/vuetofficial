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
import PersonalAssistantScreen from 'screens/SettingsScreens/PersonalAssistantScreen';
import WhatMyFamilySeesScreen from 'screens/SettingsScreens/WhatMyFamilySeesScreen';
import AddingTasksScreen from 'screens/SettingsScreens/AddingTasksScreen';
import DayPreferencesScreen from 'screens/SettingsScreens/DayPreferencesScreen';
import CategoryPreferencesScreen from 'screens/SettingsScreens/CategoryPreferencesScreen';
import TaskLimitsScreen from 'screens/SettingsScreens/TaskLimitsScreen';
import FlexibleTaskPreferencesScreen from 'screens/SettingsScreens/FlexibleTaskPreferencesScreen';
import BlockedDayPreferencesScreen from 'screens/SettingsScreens/BlockedDayPreferencesScreen';
import PreferredDayPreferencesScreen from 'screens/SettingsScreens/PreferredDayPreferencesScreen';

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
        name="PersonalAssistant"
        component={PersonalAssistantScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="WhatMyFamilySees"
        component={WhatMyFamilySeesScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="AddingTasks"
        component={AddingTasksScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="DayPreferences"
        component={DayPreferencesScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="BlockedDayPreferences"
        component={BlockedDayPreferencesScreen}
        options={{
          title: t('pageTitles.blockedDayPreferences'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="PreferredDayPreferences"
        component={PreferredDayPreferencesScreen}
        options={{
          title: t('pageTitles.preferredDayPreferences'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="CategoryPreferences"
        component={CategoryPreferencesScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="TaskLimits"
        component={TaskLimitsScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
          headerTintColor
        }}
      />
      <SettingsStack.Screen
        name="FlexibleTaskPreferences"
        component={FlexibleTaskPreferencesScreen}
        options={{
          title: t('pageTitles.personalAssistant'),
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

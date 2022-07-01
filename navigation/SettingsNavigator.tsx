import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { SettingsTabParamList } from '../types/base';
import SettingsScreen from 'screens/SettingsScreen';
import FamilySettingsScreen from 'screens/SettingsScreens/FamilySettingsScreen';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from 'components/Themed';

const SettingsStack = createNativeStackNavigator<SettingsTabParamList>();

export function SettingsNavigator() {
  const { t } = useTranslation();
  const headerTintColor = useThemeColor({}, 'primary');

  return (
    <SettingsStack.Navigator initialRouteName="Settings">
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('pageTitles.settings'),
          headerTintColor
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
    </SettingsStack.Navigator>
  );
}

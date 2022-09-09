import { createDrawerNavigator } from '@react-navigation/drawer';

import * as React from 'react';

import { SideNavigatorTabParamList } from '../types/base';

import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import { BottomTabNavigator } from './RootNavigator';
import CalendarScreen from 'screens/CalendarMain/CalendarScreen';

const SideDrawer = createDrawerNavigator<SideNavigatorTabParamList>();

export function SideNavigator() {
  return (
    <SideDrawer.Navigator
      initialRouteName="BottomTabNavigator"
      screenOptions={{ headerShown: false }}
    >
      <SideDrawer.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
    </SideDrawer.Navigator>
  );
}

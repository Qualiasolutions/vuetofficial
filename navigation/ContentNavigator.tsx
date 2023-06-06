import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { ContentTabParamList as ContentTabParamList } from '../types/base';

import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import EntityListScreen from 'screens/EntityPages/EntityListScreen';
import CategoryListScreen from 'screens/Categories/CategoryListScreen';
import EntityScreen from 'screens/EntityPages/EntityScreens/EntityScreen';
import ChildEntitiesScreen from 'screens/EntityPages/EntityScreens/ChildEntitiesScreen';
import LinkListScreen from 'screens/LinkListScreen';
import HolidayListScreen from 'screens/EntityPages/HolidayListScreen';
import HolidayDetailScreen from 'screens/EntityPages/HolidayDetailScreen';
import EditEntityScreen from 'screens/Forms/EntityForms/EditEntityScreen';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import ChildEntitiesCalendarScreen from 'screens/EntityPages/EntityScreens/ChildEntitiesCalendarScreen';
import EntityPeriodsScreen from 'screens/EntityPages/EntityPeriodsScreen';
import ChildEntitiesPeriodsScreen from 'screens/EntityPages/EntityScreens/ChildEntitiesPeriodsScreen';
import CategoryPreferencesScreen from 'screens/Categories/CategoryPreferencesScreen';
import SubCategoryListScreen from 'screens/Categories/SubCategoryListScreen';
import BlockedDaysSettingsScreen from 'screens/Categories/BlockedDaySettingsScreen';

const ContentStack = createNativeStackNavigator<ContentTabParamList>();

export function ContentNavigator() {
  return (
    <ContentStack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold'
        }
      }}
    >
      <ContentStack.Screen
        name="Categories"
        component={CategoriesGrid}
        options={{ headerShown: false }}
      />
      <ContentStack.Screen
        name="EntityList"
        component={EntityListScreen}
        options={{
          headerShown: true
        }}
      />

      <ContentStack.Screen
        name="HolidayList"
        component={HolidayListScreen}
        options={{
          headerShown: true
        }}
      />

      <ContentStack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="SubCategoryList"
        component={SubCategoryListScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="BlockedDaysSettings"
        component={BlockedDaysSettingsScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="CategoryPreferences"
        component={CategoryPreferencesScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="EntityScreen"
        component={EntityScreen}
        options={{
          headerShown: false
        }}
      />
      <ContentStack.Screen
        name="EntityPeriods"
        component={EntityPeriodsScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="ChildEntitiesScreen"
        component={ChildEntitiesScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="ChildEntitiesCalendarScreen"
        component={ChildEntitiesCalendarScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="ChildEntitiesPeriodsScreen"
        component={ChildEntitiesPeriodsScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="LinkList"
        component={LinkListScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="HolidayDetail"
        component={HolidayDetailScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="EditEntity"
        component={EditEntityScreen}
        options={{
          headerShown: false
        }}
      />
      <ContentStack.Screen
        name="AddEntity"
        component={AddEntityScreen}
        options={{
          headerShown: false
        }}
      />
    </ContentStack.Navigator>
  );
}

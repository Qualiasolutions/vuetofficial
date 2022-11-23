import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { EntityTabParamList } from '../types/base';

import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import EntityListScreen from 'screens/EntityPages/EntityListScreen';
import EntityTypeListScreen from 'screens/EntityPages/LinkListScreen/EntityTypeListScreen';
import EntityScreen from 'screens/EntityPages/EntityScreens/EntityScreen';
import ChildEntitiesScreen from 'screens/EntityPages/EntityScreens/ChildEntitiesScreen';
import LinkListScreen from 'screens/EntityPages/LinkListScreen/LinkListScreen';
import HolidayListScreen from 'screens/EntityPages/HolidayListScreen';
import HolidayDetailScreen from 'screens/EntityPages/HolidayDetailScreen';
import EditEntityScreen from 'screens/Forms/EntityForms/EditEntityScreen';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import ChildEntitiesCalendarScreen from 'screens/EntityPages/EntityScreens/ChildEntitiesCalendarScreen';
import EntityPeriodsScreen from 'screens/EntityPages/EntityPeriodsScreen';
import CategoryCalendarScreen from 'screens/EntityPages/CategoryCalendarScreen';
import EntityTypesCalendarScreen from 'screens/EntityPages/EntityTypesCalendarScreen';
import ChildEntitiesPeriodsScreen from 'screens/EntityPages/EntityScreens/ChildEntitiesPeriodsScreen';

const EntityStack = createNativeStackNavigator<EntityTabParamList>();

export function EntityNavigator() {
  return (
    <EntityStack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold'
        }
      }}
    >
      <EntityStack.Screen
        name="Categories"
        component={CategoriesGrid}
        options={{ headerShown: false }}
      />
      <EntityStack.Screen
        name="EntityList"
        component={EntityListScreen}
        options={{
          headerShown: true
        }}
      />

      <EntityStack.Screen
        name="HolidayList"
        component={HolidayListScreen}
        options={{
          headerShown: true
        }}
      />

      <EntityStack.Screen
        name="EntityTypeList"
        component={EntityTypeListScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="EntityScreen"
        component={EntityScreen}
        options={{
          headerShown: false
        }}
      />
      <EntityStack.Screen
        name="EntityPeriods"
        component={EntityPeriodsScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="ChildEntitiesScreen"
        component={ChildEntitiesScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="ChildEntitiesCalendarScreen"
        component={ChildEntitiesCalendarScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="ChildEntitiesPeriodsScreen"
        component={ChildEntitiesPeriodsScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="CategoryCalendarScreen"
        component={CategoryCalendarScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="EntityTypesCalendarScreen"
        component={EntityTypesCalendarScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="LinkList"
        component={LinkListScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="HolidayDetail"
        component={HolidayDetailScreen}
        options={{
          headerShown: true
        }}
      />
      <EntityStack.Screen
        name="EditEntity"
        component={EditEntityScreen}
        options={{
          headerShown: false
        }}
      />
      <EntityStack.Screen name="AddEntity" component={AddEntityScreen} />
    </EntityStack.Navigator>
  );
}

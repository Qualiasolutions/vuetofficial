import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { EntityTabParamList } from '../types/base';

import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import EntityListScreen from 'screens/EntityPages/EntityListScreen';
import EntityTypeListScreen from 'screens/EntityPages/LinkListScreen/EntityTypeListScreen';
import EntityScreen from 'screens/EntityPages/EntityScreen/EntityScreen';
import ChildEntitiesScreen from 'screens/EntityPages/EntityScreen/ChildEntitiesScreen';
import LinkListScreen from 'screens/EntityPages/LinkListScreen/LinkListScreen';
import HolidayListScreen from 'screens/EntityPages/HolidayListScreen';
import HolidayDetailScreen from 'screens/EntityPages/EntityScreen/HolidayDetailScreen';
import EditEntityScreen from 'screens/Forms/EntityForms/EditEntityScreen';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';

const EntityStack = createNativeStackNavigator<EntityTabParamList>();

export function EntityNavigator() {
  return (
    <EntityStack.Navigator initialRouteName="Categories">
      <EntityStack.Screen
        name="Categories"
        component={CategoriesGrid}
        options={{ headerShown: false }}
      />
      <EntityStack.Screen
        name="EntityList"
        component={EntityListScreen}
        options={{
          headerShown: true,
        }}
      />

      <EntityStack.Screen
        name="HolidayList"
        component={HolidayListScreen}
        options={{
          headerShown: true,
        }}
      />

      <EntityStack.Screen
        name="EntityTypeList"
        component={EntityTypeListScreen}
        options={{
          headerShown: true,
        }}
      />
      <EntityStack.Screen
        name="EntityScreen"
        component={EntityScreen}
        options={{
          headerShown: true,
        }}
      />
      <EntityStack.Screen
        name="ChildEntitiesScreen"
        component={ChildEntitiesScreen}
        options={{
          headerShown: true,
        }}
      />
      <EntityStack.Screen
        name="LinkList"
        component={LinkListScreen}
        options={{
          headerShown: true,
        }}
      />
      <EntityStack.Screen
        name="HolidayDetail"
        component={HolidayDetailScreen}
        options={{
          headerShown: true,
        }}
      />
      <EntityStack.Screen name="EditEntity" component={EditEntityScreen} />
      <EntityStack.Screen
        name="AddEntity"
        component={AddEntityScreen}
      />
    </EntityStack.Navigator>
  );
}

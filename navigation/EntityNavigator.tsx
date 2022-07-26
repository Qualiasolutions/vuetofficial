import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { EntityTabParamList } from '../types/base';

import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import EntityListScreen from 'screens/EntityPages/EntityListScreen';
import EntityTypeListScreen from 'screens/EntityPages/LinkListScreen/EntityTypeListScreen';
import EntityScreen from 'screens/EntityPages/EntityScreen/EntityScreen';
import ChildEntitiesScreen from 'screens/EntityPages/EntityScreen/ChildEntitiesScreen';
import LinkListScreen from 'screens/EntityPages/LinkListScreen/LinkListScreen';

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
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
      <EntityStack.Screen
        name="EntityTypeList"
        component={EntityTypeListScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
      <EntityStack.Screen
        name="EntityScreen"
        component={EntityScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
      <EntityStack.Screen
        name="ChildEntitiesScreen"
        component={ChildEntitiesScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
      <EntityStack.Screen
        name="LinkList"
        component={LinkListScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
    </EntityStack.Navigator>
  );
}

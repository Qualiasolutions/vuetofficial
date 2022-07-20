import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { EntityTabParamList } from '../types/base';

import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import EntityListScreen from 'screens/EntityPages/EntityListScreen';
import EntityTypeListScreen from 'screens/EntityPages/EntityTypeListScreen';
import EntityScreen from 'screens/EntityPages/EntityScreen/EntityScreen';

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
    </EntityStack.Navigator>
  );
}

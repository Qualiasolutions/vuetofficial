import {
  CategoriesStackParamList
} from '../types/base';
import CategoriesGrid from '../screens/Categories/CategoriesGrid';
import Transport from '../screens/Categories/Transport';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const CategoriesStack =
  createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesNavigator() {
  return (
    <CategoriesStack.Navigator>
      <CategoriesStack.Screen
        name="CategoriesGrid"
        component={CategoriesGrid}
        options={{ headerShown: false }}
      />
      <CategoriesStack.Screen
        name="Transport"
        component={Transport}
        options={{ headerShown: false }}
      />
    </CategoriesStack.Navigator>
  );
}
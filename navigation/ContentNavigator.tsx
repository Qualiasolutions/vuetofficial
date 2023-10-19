import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { ContentTabParamList as ContentTabParamList } from '../types/base';

import EntityListScreen from 'screens/EntityPages/EntityListScreen';
import CategoryListScreen from 'screens/Categories/CategoryListScreen';
import EntityScreen from 'screens/EntityPages/EntityScreens/EntityScreen';
import LinkListScreen from 'screens/LinkListScreen';
import HolidayListScreen from 'screens/EntityPages/HolidayListScreen';
import HolidayDetailScreen from 'screens/EntityPages/HolidayDetailScreen';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import CategoryPreferencesScreen from 'screens/Categories/CategoryPreferencesScreen';
import SubCategoryListScreen from 'screens/Categories/SubCategoryListScreen';
import BlockedDaysSettingsScreen from 'screens/Categories/BlockedDaySettingsScreen';
import TagScreen from 'screens/EntityPages/TagScreen';
import AllReferencesScreen from 'screens/AllReferencesScreen';
import AnniversaryDatesScreen from 'screens/EntityPages/AnniversaryDatesScreen';
import HolidayDatesScreen from 'screens/EntityPages/HolidayDatesScreen';
import AddHolidayTaskScreen from 'screens/Forms/TaskForms/AddHolidayTaskScreen';
import SchoolTermsScreen from 'screens/SchoolTermsScreen';
import { useTranslation } from 'react-i18next';
import CategoriesPage from 'screens/Categories/CategoriesPage';
import ProfessionalCategoryNavigator from './ProfessionalCategoryNavigator';

const ContentStack = createNativeStackNavigator<ContentTabParamList>();

export function ContentNavigator() {
  const { t } = useTranslation();
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
        component={CategoriesPage}
        options={{ headerShown: false }}
      />
      <ContentStack.Screen
        name="AllReferences"
        component={AllReferencesScreen}
        options={{ headerShown: true, title: t('pageTitles.references') }}
      />
      <ContentStack.Screen
        name="EntityList"
        component={EntityListScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="AnniversaryDates"
        component={AnniversaryDatesScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="HolidayDates"
        component={HolidayDatesScreen}
        options={{
          headerShown: true
        }}
      />
      <ContentStack.Screen
        name="TagScreen"
        component={TagScreen}
        options={{
          headerShown: false
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
          headerShown: false
        }}
      />
      <ContentStack.Screen
        name="ProfessionalCategory"
        component={ProfessionalCategoryNavigator}
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
        name="AddEntity"
        component={AddEntityScreen}
        options={{
          headerShown: false
        }}
      />
      <ContentStack.Screen
        name="AddHolidayTask"
        component={AddHolidayTaskScreen}
        options={{
          title: 'Add Holiday'
        }}
      />
      <ContentStack.Screen
        name="SchoolTerms"
        component={SchoolTermsScreen}
        options={{
          headerShown: true
        }}
      />
    </ContentStack.Navigator>
  );
}

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import AddTaskScreen from 'screens/Forms/TaskForms/AddTaskScreen';
import { RootTabParamList } from '../types/base';

import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import EntityTypeListScreen from 'screens/EntityPages/EntityTypeListScreen';

import Transport from 'screens/Categories/Transport';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import EditEntityScreen from 'screens/Forms/EntityForms/EditEntityScreen';
import EditTaskScreen from 'screens/Forms/TaskForms/EditTaskScreen';
import { EntityScreen } from 'screens/EntityPages/EntityScreen';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { ConditionallyTintedImage } from 'components/molecules/ImageComponents';
import {
  AlmostBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import { PrimaryColouredView } from 'components/molecules/ViewComponents';
import { useThemeColor } from 'components/Themed';
import { SettingsNavigator } from './SettingsNavigator';
import setupPushNotifications from 'hooks/setupPushNotifications';
import EntityListScreen from 'screens/EntityPages/EntityListScreen';

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -5
  }
});

const AddButton = ({ children, onPress }: { [key: string]: any }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow
    }}
    onPress={onPress}
  >
    <PrimaryColouredView
      style={{
        width: 70,
        height: 70,
        borderRadius: 35
      }}
    >
      {children}
    </PrimaryColouredView>
  </TouchableOpacity>
);

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetAllTasksQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });

  setupPushNotifications();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarShowLabel: false,
        tabBarStyle: {
          left: 0,
          right: 0,
          backgroundColor: useThemeColor({}, 'white'),
          height: 80,
          padding: 10,
          ...styles.shadow
        }
      }}
      backBehavior="history"
    >
      <BottomTab.Screen
        name="Home"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <ConditionallyTintedImage
                source={require('../assets/images/Home.png')}
                resizeMode="contain"
                tinted={focused}
                style={{
                  width: 25,
                  height: 25
                }}
              />
              {focused ? (
                <PrimaryText
                  text={t('pageTitles.home')}
                  style={{ fontSize: 10 }}
                />
              ) : (
                <AlmostBlackText
                  text={t('pageTitles.home')}
                  style={{ fontSize: 10 }}
                />
              )}
            </View>
          )
        }}
      />
      <BottomTab.Screen
        name="Categories"
        component={CategoriesGrid}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <ConditionallyTintedImage
                source={require('../assets/images/Dashboard.png')}
                resizeMode="contain"
                tinted={focused}
                style={{
                  width: 25,
                  height: 25
                }}
              />
              {focused ? (
                <PrimaryText
                  text={t('pageTitles.categories')}
                  style={{ fontSize: 10 }}
                />
              ) : (
                <AlmostBlackText
                  text={t('pageTitles.categories')}
                  style={{ fontSize: 10 }}
                />
              )}
            </View>
          )
        }}
      />
      <BottomTab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../assets/images/plus_icon.png')}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor: '#fff'
              }}
            />
          ),
          tabBarButton: (props) => <AddButton {...props} />
        }}
      />
      <BottomTab.Screen
        name="EntityScreen"
        component={EntityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <ConditionallyTintedImage
                source={require('../assets/images/Calendar.png')}
                resizeMode="contain"
                tinted={focused}
                style={{
                  width: 25,
                  height: 25
                }}
              />
              {focused ? (
                <PrimaryText
                  text={t('pageTitles.calendar')}
                  style={{ fontSize: 10 }}
                />
              ) : (
                <AlmostBlackText
                  text={t('pageTitles.calendar')}
                  style={{ fontSize: 10 }}
                />
              )}
            </View>
          )
        }}
      />
      <BottomTab.Screen
        name="SettingsNavigator"
        component={SettingsNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <ConditionallyTintedImage
                source={require('../assets/images/Chat.png')}
                resizeMode="contain"
                tinted={focused}
                style={{
                  width: 25,
                  height: 25
                }}
              />
              {focused ? (
                <PrimaryText
                  text={t('pageTitles.settings')}
                  style={{ fontSize: 10 }}
                />
              ) : (
                <AlmostBlackText
                  text={t('pageTitles.settings')}
                  style={{ fontSize: 10 }}
                />
              )}
            </View>
          )
        }}
      />
      <BottomTab.Screen
        name="Transport"
        component={Transport}
        options={{
          tabBarButton: (props) => null,
          title: t('pageTitles.transport'),
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="EntityTypeList"
        component={EntityTypeListScreen}
        options={{
          tabBarButton: (props) => null,
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
      <BottomTab.Screen
        name="EntityList"
        component={EntityListScreen}
        options={{
          tabBarButton: (props) => null,
          headerShown: true,
          headerStyle: { backgroundColor: 'transparent' }
        }}
      />
      <BottomTab.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{
          tabBarButton: (props) => null,
          title: t('pageTitles.oops')
        }}
      />
      <BottomTab.Screen
        name="AddEntity"
        component={AddEntityScreen}
        options={{
          tabBarButton: (props) => null,
          title: t('pageTitles.addEntity'),
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="EditEntity"
        component={EditEntityScreen}
        options={{
          tabBarButton: (props) => null,
          title: t('pageTitles.editEntity'),
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          tabBarButton: (props) => null,
          title: t('pageTitles.editTask'),
          headerShown: false
        }}
      />
    </BottomTab.Navigator>
  );
}

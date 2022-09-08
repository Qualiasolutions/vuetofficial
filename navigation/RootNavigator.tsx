import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, View, ImageSourcePropType } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import AddTaskScreen from 'screens/Forms/TaskForms/AddTaskScreen';
import CreateTask from 'screens/CreateTask/CreateTask';
import { RootTabParamList } from '../types/base';

import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

import EditTaskScreen from 'screens/Forms/TaskForms/EditTaskScreen';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { ConditionallyTintedImage } from 'components/molecules/ImageComponents';
import {
  AlmostBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import { SettingsNavigator } from './SettingsNavigator';
import setupPushNotifications from 'hooks/setupPushNotifications';
import { EntityNavigator } from './EntityNavigator';
import BottomNavBar from 'components/navBar/BottomNavBar';
import Calendar from 'screens/Calendar/Calendar';
import { useGetAllFriendshipsQuery } from 'reduxStore/services/api/friendships';

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -5,
    width: 60
  },
  barIconImage: {
    width: 26,
    height: 26
  },
  barIconText: {
    fontSize: 10
  }
});

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const BarIcon = ({
  focused,
  imageSource,
  title
}: {
  focused: boolean;
  imageSource: ImageSourcePropType;
  title: string;
}) => {
  return (
    <View style={styles.icon}>
      <ConditionallyTintedImage
        source={imageSource}
        resizeMode="contain"
        tinted={focused}
        style={styles.barIconImage}
      />
      {focused ? (
        <PrimaryText text={title} style={styles.barIconText} />
      ) : (
        <AlmostBlackText text={title} style={styles.barIconText} />
      )}
    </View>
  );
};

export function BottomTabNavigator() {
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
  useGetAllFriendshipsQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetUserInvitesQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });

  setupPushNotifications();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center'
      }}
      backBehavior="history"
      tabBar={(props) => <BottomNavBar {...props} />}
    >
      <BottomTab.Screen
        name="Home"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              imageSource={require('../assets/images/Home.png')}
              title={t('pageTitles.home')}
            />
          )
        }}
      />
      <BottomTab.Screen
        name="EntityNavigator"
        component={EntityNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              imageSource={require('../assets/images/Dashboard.png')}
              title={t('pageTitles.categories')}
            />
          )
        }}
      />
      <BottomTab.Screen name="CreateTask" component={CreateTask} />
      <BottomTab.Screen
        name="Calendar" // This is just a placeholder really, not sure where it's supposed to go
        component={Calendar}
        options={{
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              imageSource={require('../assets/images/Calendar.png')}
              title={t('pageTitles.calendar')}
            />
          )
        }}
      />
      <BottomTab.Screen
        name="SettingsNavigator"
        component={SettingsNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              imageSource={require('../assets/images/Chat.png')}
              title={t('pageTitles.messages')}
            />
          )
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
        name="EditTask"
        component={EditTaskScreen}
        options={{
          tabBarButton: (props) => null,
          title: t('pageTitles.editTask')
        }}
      />
      <BottomTab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          tabBarButton: (props) => null,
          title: 'Add Task'
        }}
      />
    </BottomTab.Navigator>
  );
}

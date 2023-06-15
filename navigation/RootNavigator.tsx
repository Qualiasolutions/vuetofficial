import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { StyleSheet, View, ImageSourcePropType } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import AddTaskScreen from 'screens/Forms/TaskForms/AddTaskScreen';
import { RootTabParamList } from '../types/base';

import { useTranslation } from 'react-i18next';

import EditTaskScreen from 'screens/Forms/TaskForms/EditTaskScreen';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';
import {
  useGetAllScheduledTasksQuery,
  useGetAllTasksQuery
} from 'reduxStore/services/api/tasks';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { ConditionallyTintedImage } from 'components/molecules/ImageComponents';
import {
  AlmostBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import useSetupPushNotifications from 'hooks/setupPushNotifications';
import { ContentNavigator } from './ContentNavigator';
import BottomNavBar from 'components/navBar/BottomNavBar';
import PeriodCalendar from 'screens/PeriodCalendar/PeriodCalendar';
import { useGetAllFriendshipsQuery } from 'reduxStore/services/api/friendships';
import ChatScreen from 'screens/ChatScreen';
import { useGetAllAlertsQuery } from 'reduxStore/services/api/alerts';
import { useGetTaskCompletionFormsQuery } from 'reduxStore/services/api/taskCompletionForms';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';
import RoutineTasksScreen from 'screens/RoutineTasksScreen';

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
  const { data: userDetails } = useGetUserDetailsQuery();

  useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetUserInvitesQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetAllAlertsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetTaskCompletionFormsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetAllRoutinesQuery(null as any, {
    skip: !userDetails?.user_id
  });

  useSetupPushNotifications();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold'
        }
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
          ),
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="ContentNavigator"
        component={ContentNavigator}
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
      <BottomTab.Screen name="PlusButton" component={CalendarScreen} />
      <BottomTab.Screen
        name="Calendar"
        component={PeriodCalendar}
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
        name="Chat"
        component={ChatScreen}
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
          tabBarButton: () => null,
          title: t('pageTitles.oops')
        }}
      />
      <BottomTab.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          tabBarButton: () => null,
          title: t('pageTitles.editTask')
        }}
      />
      <BottomTab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          tabBarButton: () => null,
          title: 'Add Task'
        }}
      />
      <BottomTab.Screen
        name="RoutineTasks"
        component={RoutineTasksScreen}
        options={{
          tabBarButton: () => null,
          title: 'Routine'
        }}
      />
    </BottomTab.Navigator>
  );
}

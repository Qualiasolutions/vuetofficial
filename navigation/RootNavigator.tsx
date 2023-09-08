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
  useGetCategorySetupCompletionsQuery,
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';
import { ConditionallyTintedImage } from 'components/molecules/ImageComponents';
import {
  AlmostBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import useSetupPushNotifications from 'hooks/setupPushNotifications';
import { ContentNavigator } from './ContentNavigator';
import BottomNavBar from 'components/navBar/BottomNavBar';
import { useGetAllAlertsQuery } from 'reduxStore/services/api/alerts';
import {
  useGetTaskActionCompletionFormsQuery,
  useGetTaskCompletionFormsQuery
} from 'reduxStore/services/api/taskCompletionForms';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';
import RoutineTasksScreen from 'screens/RoutineTasksScreen';
import { useGetAllTaskActionsQuery } from 'reduxStore/services/api/taskActions';
import {
  useGetAllEntitiesQuery,
  useGetMemberEntitiesQuery
} from 'reduxStore/services/api/entities';
import { useGetAllTagsQuery } from 'reduxStore/services/api/tags';
import MessagesNavigator from './MessagesNavigator';
import { BackOnlyHeaderWithSafeArea } from 'headers/BackOnlyHeader';
import EditTaskOccurrenceScreen from 'screens/Forms/TaskForms/EditTaskOccurrenceScreen';
import ListsNavigator from 'components/organisms/ListsNavigator';
import AlertsList from 'components/organisms/AlertsList';
import NewItemsList from 'components/organisms/NewItemsList';
import QuickJot from 'components/organisms/QuickJot';
import OverdueTasksList from 'components/organisms/OverdueTasksList';

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

export function BottomTabNavigator({
  hasJustSignedUp
}: {
  hasJustSignedUp: boolean;
}) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetailsQuery();

  useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetUserInvitesQuery(null as any, {
    refetchOnMountOrArgChange: true,
    skip: !userDetails?.user_id
  });
  useGetAllAlertsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetAllTaskActionsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetTaskCompletionFormsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetTaskActionCompletionFormsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetAllRoutinesQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetMemberEntitiesQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetAllEntitiesQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetAllTagsQuery(null as any, {
    skip: !userDetails?.user_id
  });
  useGetCategorySetupCompletionsQuery(null as any, {
    skip: !userDetails?.user_id
  });

  useSetupPushNotifications();

  return (
    <BottomTab.Navigator
      initialRouteName={hasJustSignedUp ? 'ContentNavigator' : 'Home'}
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
        name="Lists"
        component={ListsNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <BarIcon
              focused={focused}
              imageSource={require('../assets/images/List.png')}
              title={t('pageTitles.lists')}
            />
          ),
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={MessagesNavigator}
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
          title: t('pageTitles.editTask'),
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="EditTaskOccurrence"
        component={EditTaskOccurrenceScreen}
        options={{
          tabBarButton: () => null,
          title: t('pageTitles.editTask'),
          header: BackOnlyHeaderWithSafeArea
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
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="Alerts"
        component={AlertsList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="NewItems"
        component={NewItemsList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="OverdueTasks"
        component={OverdueTasksList}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
      <BottomTab.Screen
        name="QuickJot"
        component={QuickJot}
        options={{
          tabBarButton: () => null,
          title: '',
          header: BackOnlyHeaderWithSafeArea
        }}
      />
    </BottomTab.Navigator>
  );
}

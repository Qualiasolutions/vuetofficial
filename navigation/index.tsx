/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddTaskScreen from 'screens/Forms/TaskForms/AddTaskScreen';
import { RootTabParamList, UnauthorisedStackParamList } from '../types/base';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from '../screens/LoginScreen';

import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from '../reduxStore/slices/auth/actions';

import { verifyTokenAsync, refreshTokenAsync } from '../utils/authRequests';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectRefreshToken
} from 'reduxStore/slices/auth/selectors';
import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import Transport from 'screens/Categories/Transport';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import EditEntityScreen from 'screens/Forms/EntityForms/EditEntityScreen';
import EditTaskScreen from 'screens/Forms/TaskForms/EditTaskScreen';
import { EntityScreen } from 'screens/EntityPages/EntityScreen';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const UnauthorisedStack =
  createNativeStackNavigator<UnauthorisedStackParamList>();

function UnauthorisedNavigator() {
  return (
    <UnauthorisedStack.Navigator>
      <UnauthorisedStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </UnauthorisedStack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint
      }}
      backBehavior="history"
    >
      <BottomTab.Screen
        name="Home"
        component={CalendarScreen}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Categories"
        component={CategoriesGrid}
        options={{
          title: 'Categories',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="th" color={color} />
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />
        }}
      />
      <BottomTab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          title: 'AddTask',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />
        }}
      />
      <BottomTab.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          tabBarButton: (props) => null,
          title: 'EditTask',
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="Transport"
        component={Transport}
        options={{
          tabBarButton: (props) => null,
          title: 'AddTask',
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="AddEntity"
        component={AddEntityScreen}
        options={{
          tabBarButton: (props) => null,
          title: 'AddEntity',
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="EditEntity"
        component={EditEntityScreen}
        options={{
          tabBarButton: (props) => null,
          title: 'EditEntity',
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="EntityScreen"
        component={EntityScreen}
        options={{
          tabBarButton: (props) => null,
          title: 'EntityScreen',
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{
          tabBarButton: (props) => null,
          title: 'Oops!'
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

interface NavigationProps {
  colorScheme: ColorSchemeName;
}

const Navigation = ({ colorScheme }: NavigationProps) => {
  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);
  const jwtRefreshToken = useSelector(selectRefreshToken);

  React.useEffect(() => {
    const verifyToken = async () => {
      if (jwtAccessToken || jwtRefreshToken) {
        const verifyAccessResponse = await verifyTokenAsync(jwtAccessToken);
        if (verifyAccessResponse.code) {
          const verifyRefreshResponse = await verifyTokenAsync(jwtRefreshToken);
          if (verifyRefreshResponse.code) {
            dispatch(setAccessToken(''));
            dispatch(setRefreshToken(''));
            dispatch(setUsername(''));
          } else {
            const refreshedAccessCode = (
              await refreshTokenAsync(jwtRefreshToken)
            ).access;
            dispatch(setAccessToken(refreshedAccessCode));
          }
        }
      }
    };

    verifyToken();
  }, [jwtAccessToken, jwtRefreshToken]);

  const navigatorComponent =
    jwtAccessToken && jwtRefreshToken ? (
      <BottomTabNavigator />
    ) : (
      <UnauthorisedNavigator />
    );

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {navigatorComponent}
    </NavigationContainer>
  );
};

export default Navigation;

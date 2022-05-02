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
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
  UnauthorisedStackParamList
} from '../types/base';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from '../screens/LoginScreen';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from '@reduxjs/toolkit';
import { EntireState } from '../reduxStore/types';
import { AuthReducerActionType } from '../reduxStore/slices/auth/types'
import { setAccessToken, setRefreshToken, setUsername } from '../reduxStore/slices/auth/actions';

import {
  getTokenAsync,
  verifyTokenAsync,
  refreshTokenAsync
} from '../utils/authRequests';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();
const UnauthorisedStack =
  createNativeStackNavigator<UnauthorisedStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

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
        component={CategoriesScreen}
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
  jwtAccessToken: string;
  jwtRefreshToken: string;
  username: string;
  setAccessTokenProp: Function;
  setRefreshTokenProp: Function;
  setUsernameProp: Function;
}

const Navigation = ({
  colorScheme,
  jwtAccessToken,
  jwtRefreshToken,
  setAccessTokenProp,
  setRefreshTokenProp,
  setUsernameProp
}: NavigationProps) => {
  React.useEffect(() => {
    const verifyToken = async () => {
      if (jwtAccessToken || jwtRefreshToken) {
        const verifyAccessResponse = await verifyTokenAsync(jwtAccessToken);
        if (verifyAccessResponse.code) {
          const verifyRefreshResponse = await verifyTokenAsync(jwtRefreshToken);
          if (verifyRefreshResponse.code) {
            setRefreshTokenProp('');
            setAccessTokenProp('');
            setUsernameProp('');
          } else {
            const refreshedAccessCode = (
              await refreshTokenAsync(jwtRefreshToken)
            ).access;
            setAccessTokenProp(refreshedAccessCode);
          }
        }
      }
    };

    verifyToken();
  }, [jwtAccessToken, jwtRefreshToken]);

  const navigatorComponent =
    jwtAccessToken && jwtRefreshToken ? (
      <RootNavigator />
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

const mapStateToProps = (state: EntireState) => ({
  jwtAccessToken: state.authentication.jwtAccessToken,
  jwtRefreshToken: state.authentication.jwtRefreshToken,
  username: state.authentication.username
});

const mapDispatchToProps = (dispatch: Dispatch<AuthReducerActionType>) => {
  return bindActionCreators(
    {
      setAccessTokenProp: setAccessToken,
      setRefreshTokenProp: setRefreshToken,
      setUsernameProp: setUsername
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);

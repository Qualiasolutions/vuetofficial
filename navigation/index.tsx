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
import {
  ColorSchemeName,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import CalendarScreen from '../screens/CalendarMain/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddTaskScreen from 'screens/Forms/TaskForms/AddTaskScreen';
import { RootTabParamList, UnauthorisedTabParamList } from '../types/base';
import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from 'screens/AuthScreens/LoginScreen';
import SignupScreen from 'screens/AuthScreens/SignupScreen';
import ValidatePhoneScreen from 'screens/AuthScreens/ValidatePhoneScreen';
import CreatePasswordScreen from 'screens/AuthScreens/CreatePasswordScreen';

import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectRefreshToken,
  selectUsername
} from 'reduxStore/slices/auth/selectors';
import CategoriesGrid from 'screens/Categories/CategoriesGrid';
import Transport from 'screens/Categories/Transport';
import AddEntityScreen from 'screens/Forms/EntityForms/AddEntityScreen';
import EditEntityScreen from 'screens/Forms/EntityForms/EditEntityScreen';
import EditTaskScreen from 'screens/Forms/TaskForms/EditTaskScreen';
import { EntityScreen } from 'screens/EntityPages/EntityScreen';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/api';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';

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

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const UnauthorisedStack =
  createNativeStackNavigator<UnauthorisedTabParamList>();

function UnauthorisedNavigator() {
  return (
    <UnauthorisedStack.Navigator>
      <UnauthorisedStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="ValidatePhone"
        component={ValidatePhoneScreen}
        options={{ headerShown: false }}
      />
      <UnauthorisedStack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
        options={{ headerShown: false }}
      />
    </UnauthorisedStack.Navigator>
  );
}

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
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#e32f45'
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const username = useSelector(selectUsername)
  const { data: userDetails } = useGetUserDetailsQuery(username);

  useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true
  });
  useGetAllTasksQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true
  });
  useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    refetchOnMountOrArgChange: true
  });

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarShowLabel: false,
        tabBarStyle: {
          bottom: -10,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 90,
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
              <Image
                source={require('../assets/images/Home.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94'
                }}
              />
              <Text
                style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}
              >
                {t('pageTitles.home')}
              </Text>
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
              <Image
                source={require('../assets/images/Dashboard.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94'
                }}
              />
              <Text
                style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}
              >
                {t('pageTitles.categories')}
              </Text>
            </View>
          )
        }}
      />
      <BottomTab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
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
              <Image
                source={require('../assets/images/Calendar.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94'
                }}
              />
              <Text
                style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}
              >
                {t('pageTitles.calendar')}
              </Text>
            </View>
          )
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.icon}>
              <Image
                source={require('../assets/images/Chat.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#e32f45' : '#748c94'
                }}
              />
              <Text
                style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 10 }}
              >
                {t('pageTitles.settings')}
              </Text>
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

  // React.useEffect(() => {
  //   const verifyToken = async () => {
  //     if (jwtAccessToken || jwtRefreshToken) {
  //       const verifyAccessResponse = await verifyTokenAsync(jwtAccessToken);
  //       if (verifyAccessResponse.code) {
  //         const verifyRefreshResponse = await verifyTokenAsync(jwtRefreshToken);
  //         if (verifyRefreshResponse.code) {
  //           dispatch(setAccessToken(''));
  //           dispatch(setRefreshToken(''));
  //           dispatch(setUsername(''));
  //         } else {
  //           const refreshedAccessCode = (
  //             await refreshTokenAsync(jwtRefreshToken)
  //           ).access;
  //           dispatch(setAccessToken(refreshedAccessCode));
  //         }
  //       }
  //     }
  //   };

  //   verifyToken();
  // }, [jwtAccessToken, jwtRefreshToken]);

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

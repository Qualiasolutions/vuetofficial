import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';

import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectRefreshToken,
  selectUsername
} from 'reduxStore/slices/auth/selectors';

import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';

import { UnauthorisedNavigator } from './UnauthorisedNavigator';
import { BottomTabNavigator } from './RootNavigator';
import { SetupNavigator } from './SetupNavigator';

interface NavigationProps {
  colorScheme: ColorSchemeName;
}

const Navigation = ({ colorScheme }: NavigationProps) => {
  const jwtAccessToken = useSelector(selectAccessToken);
  const jwtRefreshToken = useSelector(selectRefreshToken);
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true
    }
  );

  let navigatorComponent = null;

  if (!(jwtAccessToken && jwtRefreshToken)) {
    navigatorComponent = <UnauthorisedNavigator />;
  } else if (!userFullDetails?.has_done_setup) {
    navigatorComponent = <SetupNavigator />;
  } else {
    navigatorComponent = <BottomTabNavigator />;
  }

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

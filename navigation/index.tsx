import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';

import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectRefreshToken
} from 'reduxStore/slices/auth/selectors';

import { UnauthorisedNavigator } from './UnauthorisedNavigator';
import { SetupNavigator } from './SetupNavigator';
import { FamilyRequestNavigator } from './FamilyRequestNavigator';
import { DarkTheme, DefaultTheme } from 'constants/Colors';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { SideNavigator } from './SideNavigator';
import useActiveInvitesForUser from 'headers/hooks/useActiveInvitesForUser';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';

interface NavigationProps {
  colorScheme: ColorSchemeName;
}

const Navigation = ({ colorScheme }: NavigationProps) => {
  const jwtAccessToken = useSelector(selectAccessToken);
  const jwtRefreshToken = useSelector(selectRefreshToken);
  const { data: userFullDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();
  const { isLoading: isLoadingUserInvites, data: invitesForUser } =
    useActiveInvitesForUser(true);

  // Force fetch of categories on app load
  useGetAllCategoriesQuery();

  const firstInviteForUser =
    invitesForUser && invitesForUser.length > 0 ? invitesForUser[0] : null;

  let navigatorComponent = <FullPageSpinner />;

  const isLoading = isLoadingUserDetails || isLoadingUserInvites;

  if (!isLoading) {
    if (!(jwtAccessToken && jwtRefreshToken)) {
      navigatorComponent = <UnauthorisedNavigator />;
    } else {
      if (firstInviteForUser) {
        navigatorComponent = <FamilyRequestNavigator />;
      } else if (!userFullDetails?.has_done_setup) {
        navigatorComponent = <SetupNavigator />;
      } else {
        navigatorComponent = <SideNavigator />;
      }
    }
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

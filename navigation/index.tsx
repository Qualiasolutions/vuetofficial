import { NavigationContainer } from '@react-navigation/native';
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
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';

import { UnauthorisedNavigator } from './UnauthorisedNavigator';
import { BottomTabNavigator } from './RootNavigator';
import { SetupNavigator } from './SetupNavigator';
import { FamilyRequestNavigator } from './FamilyRequestNavigator';
import { DarkTheme, DefaultTheme } from 'constants/Colors';
import { FullPageSpinner } from 'components/molecules/Spinners';

interface NavigationProps {
  colorScheme: ColorSchemeName;
}

const Navigation = ({ colorScheme }: NavigationProps) => {
  const jwtAccessToken = useSelector(selectAccessToken);
  const jwtRefreshToken = useSelector(selectRefreshToken);
  const username = useSelector(selectUsername);

  ///////////// Load the data

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserDetailsQuery(username, {
      skip: !(jwtAccessToken && username)
    });

  const { data: userFullDetails, isLoading: isLoadingUserFullDetails } =
    useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
      skip: !(jwtAccessToken && userDetails?.user_id)
    });

  const { data: userInvites, isLoading: isLoadingUserInvites } =
    useGetUserInvitesQuery(userFullDetails?.family?.id || -1, {
      skip: !(jwtAccessToken && userFullDetails?.family?.id)
    });

  const isLoading =
    isLoadingUserDetails || isLoadingUserFullDetails || isLoadingUserInvites;

  ///////////// Filter any relevant family invites

  const invitesForUser = userInvites?.filter(
    (invite) =>
      invite.phone_number === userFullDetails?.phone_number &&
      !invite.rejected &&
      userFullDetails?.family?.id !== invite.family &&
      !userFullDetails?.friends
        ?.map((user) => user.id)
        .includes(invite.invitee.id)
  );
  const firstInviteForUser =
    invitesForUser && invitesForUser.length > 0 ? invitesForUser[0] : null;

  /////////////

  let navigatorComponent = <FullPageSpinner />;

  if (!isLoading) {
    if (!(jwtAccessToken && jwtRefreshToken)) {
      navigatorComponent = <UnauthorisedNavigator />;
    } else if (userDetails && userFullDetails && userInvites) {
      if (firstInviteForUser) {
        navigatorComponent = <FamilyRequestNavigator />;
      } else if (!userFullDetails.has_done_setup) {
        navigatorComponent = <SetupNavigator />;
      } else {
        navigatorComponent = <BottomTabNavigator />;
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

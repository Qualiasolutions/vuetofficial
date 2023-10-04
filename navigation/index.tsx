import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LinkingConfiguration from './LinkingConfiguration';

import { useDispatch, useSelector } from 'react-redux';
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
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import TaskActionModal from 'components/molecules/TaskActionModal';
import ListItemActionModal from 'components/molecules/ListItemActionModal';
import {
  useGetAllSchoolBreaksQuery,
  useGetAllSchoolTermsQuery,
  useGetAllSchoolYearsQuery
} from 'reduxStore/services/api/schoolTerms';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import PremiumModal from 'components/molecules/PremiumModal';
import { selectFiltersModalOpen } from 'reduxStore/slices/calendars/selectors';
import { setFiltersModalOpen } from 'reduxStore/slices/calendars/actions';
import FiltersModal from 'components/organisms/FiltersModal';
import TaskPartialCompletionModal from 'components/organisms/TaskPartialCompletionModal';

interface NavigationProps {
  colorScheme: ColorSchemeName;
}

const Navigation = ({ colorScheme }: NavigationProps) => {
  const [hasJustSignedUp, setHasJustSignedUp] = React.useState(false);
  const jwtAccessToken = useSelector(selectAccessToken);
  const jwtRefreshToken = useSelector(selectRefreshToken);
  const filtersModalOpen = !!useSelector(selectFiltersModalOpen);
  const dispatch = useDispatch();
  const { data: userBasicDetails, isLoading: isLoadingDetails } =
    useGetUserDetailsQuery(undefined, { skip: !jwtAccessToken });
  const { data: userFullDetails, isLoading: isLoadingFullDetails } =
    useGetUserFullDetailsQuery(userBasicDetails?.user_id || -1, {
      refetchOnMountOrArgChange: true,
      skip: !userBasicDetails?.user_id,
      // TODO
      // This does cause some performance issues when updating -
      // would be better to use sockets so that we only refetch
      // when we actually need to
      pollingInterval: 30000
    });
  const { data: invitesForUser, isLoading: isLoadingInvitesForUser } =
    useActiveInvitesForUser(true);

  // Force fetch of categories on app load
  useGetAllCategoriesQuery(undefined, { skip: !userBasicDetails?.user_id });

  // Force fetch of School Years etc
  useGetAllSchoolYearsQuery(undefined, { skip: !userBasicDetails?.user_id });
  useGetAllSchoolTermsQuery(undefined, { skip: !userBasicDetails?.user_id });
  useGetAllSchoolBreaksQuery(undefined, { skip: !userBasicDetails?.user_id });

  const firstInviteForUser =
    invitesForUser && invitesForUser.length > 0 ? invitesForUser[0] : null;

  let navigatorComponent = <FullPageSpinner />;

  const isLoading =
    isLoadingDetails || isLoadingFullDetails || isLoadingInvitesForUser;

  if (!isLoading) {
    if (!(jwtAccessToken && jwtRefreshToken)) {
      navigatorComponent = <UnauthorisedNavigator />;
    } else {
      if (firstInviteForUser) {
        navigatorComponent = <FamilyRequestNavigator />;
      } else if (userFullDetails && !userFullDetails.has_done_setup) {
        if (!hasJustSignedUp) {
          setHasJustSignedUp(true);
        }
        navigatorComponent = <SetupNavigator />;
      } else {
        navigatorComponent = (
          <SideNavigator hasJustSignedUp={hasJustSignedUp} />
        );
      }
    }
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {navigatorComponent}
      <TaskActionModal />
      <TaskPartialCompletionModal />
      <ListItemActionModal />
      <PremiumModal />
      <FiltersModal
        visible={filtersModalOpen}
        onRequestClose={() => {
          dispatch(setFiltersModalOpen(false));
        }}
      />
    </NavigationContainer>
  );
};

export default Navigation;

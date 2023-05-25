import React from 'react';

import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Button } from 'components/molecules/ButtonComponents';

import { PageTitle, PageSubtitle } from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import {
  useUpdateUserDetailsMutation,
  useUpdateUserInviteMutation
} from 'reduxStore/services/api/user';
import { useCreateFriendshipMutation } from 'reduxStore/services/api/friendships';
import useActiveInvitesForUser from 'headers/hooks/useActiveInvitesForUser';
import getUserFullDetails from 'hooks/useGetUserDetails';

const FamilyRequestScreen = () => {
  const { data: userFullDetails } = getUserFullDetails();

  const [updateUserDetails, result] = useUpdateUserDetailsMutation();
  const [updateUserInvite, userInviteResult] = useUpdateUserInviteMutation();
  const [createFriendship, createFriendshipResult] =
    useCreateFriendshipMutation();

  const { t } = useTranslation();

  const { data: invitesForUser, isLoading: isLoadingUserInvites } =
    useActiveInvitesForUser(true);

  if (!(invitesForUser && userFullDetails)) {
    return null;
  }

  const firstInviteForUser =
    invitesForUser && invitesForUser.length > 0 ? invitesForUser[0] : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle
        text={
          firstInviteForUser?.family
            ? t('screens.familyRequest.familyTitle')
            : t('screens.familyRequest.friendTitle')
        }
      />
      <PageSubtitle
        text={
          firstInviteForUser?.family
            ? t('screens.familyRequest.familySubtitle', {
              name: `${firstInviteForUser?.invitee.first_name} ${firstInviteForUser?.invitee.last_name}`
            })
            : t('screens.familyRequest.friendSubtitle', {
              name: `${firstInviteForUser?.invitee.first_name} ${firstInviteForUser?.invitee.last_name}`
            })
        }
      />
      <Button
        title={t('common.accept')}
        onPress={() => {
          if (userFullDetails) {
            if (firstInviteForUser) {
              if (firstInviteForUser.family) {
                updateUserDetails({
                  // If the user has already done setup then don't overwrite their details
                  ...(userFullDetails.has_done_setup ? {} : firstInviteForUser),
                  user_id: userFullDetails.id,
                  family: firstInviteForUser?.family,
                  has_done_setup: true
                });
              } else {
                createFriendship({
                  friend: userFullDetails.id,
                  creator: firstInviteForUser.invitee.id
                });
              }
            }
          }
        }}
        style={styles.confirmButton}
      />
      <Button
        title={t('common.reject')}
        onPress={() => {
          if (invitesForUser) {
            updateUserInvite({
              id: invitesForUser[0].id,
              rejected: true
            });
          }
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 20
  }
});

export default FamilyRequestScreen;

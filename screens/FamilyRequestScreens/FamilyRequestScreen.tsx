import React from 'react';

import { StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/Themed';

import { PageTitle, PageSubtitle } from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery,
  useUpdateUserDetailsMutation,
  useUpdateUserInviteMutation
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useCreateFriendshipMutation } from 'reduxStore/services/api/friendships';

const FamilyRequestScreen = () => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true,
      skip: !userDetails?.user_id
    }
  );

  const { data: userInvites } = useGetUserInvitesQuery(
    userFullDetails?.family?.id || -1
  );

  const [updateUserDetails, result] = useUpdateUserDetailsMutation();
  const [updateUserInvite, userInviteResult] = useUpdateUserInviteMutation();
  const [createFriendship, createFriendshipResult] =
    useCreateFriendshipMutation();

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { t } = useTranslation();

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

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  if (!(userInvites && userFullDetails)) {
    return null;
  }

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
      {errorContent}
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

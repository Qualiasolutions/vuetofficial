import React, { useEffect } from 'react';

import { Image, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/Themed';

import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  PageTitle,
  PageSubtitle,
  AlmostBlackText
} from 'components/molecules/TextComponents';
import {
  AlmostWhiteContainerView,
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery,
  useUpdateUserDetailsMutation,
  useUpdateUserInviteMutation
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

const FamilyRequestScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'FamilyRequest'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true
    }
  );

  const { data: userInvites } =  useGetUserInvitesQuery(userFullDetails?.family?.id || -1)

  const [updateUserDetails, result] = useUpdateUserDetailsMutation();
  const [updateUserInvite, userInviteResult] = useUpdateUserInviteMutation();

  const [errorMessage, setErrorMessage] = React.useState<string>('');
  
  const { t } = useTranslation();
  
  const invitesForUser = userInvites?.filter(
    invite => (
      (invite.phone_number === userFullDetails?.phone_number)
      && (!invite.rejected)
      && userFullDetails.family
      && userFullDetails.family.id !== invite.family
    )
  )
  const firstInviteForUser = (invitesForUser && invitesForUser.length > 0)
    ? invitesForUser[0]
    : null
  
  useEffect(() => {
    if (userFullDetails && userInvites && !firstInviteForUser) {
      navigation.push('CreateAccount')
    }
  }, [firstInviteForUser, userInvites]);

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  if (!(userInvites && userFullDetails)) {
    return null
  }

  return (
    <AlmostWhiteContainerView>
      <PageTitle
        text={t('screens.familyRequest.title', {
          name: userFullDetails?.first_name
        })}
      />
      <PageSubtitle text={t('screens.familyRequest.subtitle', {
        name: `${firstInviteForUser?.invitee.first_name} ${firstInviteForUser?.invitee.last_name}`
      })} />
      {errorContent}
      <Button
        title={t('common.accept')}
        onPress={() => {
          updateUserDetails({
            ...firstInviteForUser,
            user_id: userFullDetails?.id || -1,
            has_done_setup: true
          });
        }}
        style={styles.confirmButton}
      />
      <Button
        title={t('common.reject')}
        onPress={() => {
          updateUserInvite({
            id: invitesForUser ? invitesForUser[0].id : -1,
            rejected: true,
          });
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 20,
  },
});

export default FamilyRequestScreen;

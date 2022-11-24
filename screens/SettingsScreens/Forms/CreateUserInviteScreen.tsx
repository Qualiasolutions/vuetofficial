import React, { useLayoutEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingsTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TransparentView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import RTKForm from 'components/forms/RTKForm';
import {
  familyMemberForm,
  FamilyMemberFormFieldTypes
} from './familyMemberFormFieldTypes';

import {
  useCreateUserInviteMutation,
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { deepCopy } from 'utils/copy';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { StyleSheet } from 'react-native';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { friendForm, FriendFormFieldTypes } from './friendFormFieldTypes';

const CreateUserInviteScreen = ({
  navigation,
  route
}: NativeStackScreenProps<SettingsTabParamList, 'CreateUserInvite'>) => {
  const isFamilyRequest = route.params?.familyRequest;
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: userFullDetails,
    isLoading,
    error
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const familyFormFields = deepCopy<FamilyMemberFormFieldTypes>(
    familyMemberForm()
  );
  const friendFormFields = deepCopy<FriendFormFieldTypes>(friendForm());

  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (isFamilyRequest) {
      navigation.setOptions({
        headerTitle: t('pageTitles.addFamilyMember')
      });
    } else {
      navigation.setOptions({
        headerTitle: t('pageTitles.addFriend')
      });
    }
  }, []);

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  const extraFields = {
    invitee: userFullDetails?.id
  } as { [key: string]: any };

  if (isFamilyRequest) {
    extraFields.family = userFullDetails?.family.id;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView>
        {errorContent}
        <RTKForm
          fields={isFamilyRequest ? familyFormFields : friendFormFields}
          methodHooks={{
            POST: useCreateUserInviteMutation
          }}
          formType="CREATE"
          onSubmitSuccess={() => {
            if (isFamilyRequest) {
              navigation.navigate('FamilySettings');
            } else {
              navigation.navigate('FriendSettings');
            }
          }}
          onSubmitFailure={() => {
            setErrorMessage(t('common.genericError'));
          }}
          extraFields={extraFields}
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
};

export default CreateUserInviteScreen;

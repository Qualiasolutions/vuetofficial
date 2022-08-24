import React from 'react';

import { useTranslation } from 'react-i18next';

import { SettingsTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TransparentPaddedView } from 'components/molecules/ViewComponents';
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

const AddFamilyMemberScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'AddFamilyMember'>) => {
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

  const formFields = deepCopy<FamilyMemberFormFieldTypes>(familyMemberForm());

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView style={styles.formContainer}>
      {errorContent}
      <RTKForm
        fields={formFields}
        methodHooks={{
          POST: useCreateUserInviteMutation
        }}
        formType="CREATE"
        onSubmitSuccess={() => {
          navigation.navigate('FamilySettings');
        }}
        onSubmitFailure={() => {
          setErrorMessage(t('common.genericError'));
        }}
        extraFields={{
          family: userFullDetails?.family.id,
          invitee: userFullDetails?.id
        }}
      />
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 100
  }
});

export default AddFamilyMemberScreen;

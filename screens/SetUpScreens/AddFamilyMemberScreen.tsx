import React from 'react';

import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PageTitle } from 'components/molecules/TextComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import { useCreateUserInviteMutation } from 'reduxStore/services/api/user';
import RTKForm from 'components/forms/RTKForm';

import { deepCopy } from 'utils/copy';
import {
  useFamilyMemberForm,
  FamilyMemberFormFieldTypes
} from 'screens/SettingsScreens/Forms/familyMemberFormFieldTypes';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingTop: 100
  }
});

const AddFamilyMemberScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'AddFamilyMember'>) => {
  const { data: userFullDetails } = useGetUserFullDetails();

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const formFields = deepCopy<FamilyMemberFormFieldTypes>(useFamilyMemberForm());

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage} />
  ) : null;

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView style={styles.container}>
        <PageTitle text={t('screens.addFamilyMember.title')} />
        {errorContent}
        <RTKForm
          fields={formFields}
          methodHooks={{
            POST: useCreateUserInviteMutation
          }}
          formType="CREATE"
          onSubmitSuccess={() => {
            navigation.push('AddFamily');
          }}
          onSubmitFailure={() => {
            setErrorMessage(t('common.errors.generic'));
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

export default AddFamilyMemberScreen;

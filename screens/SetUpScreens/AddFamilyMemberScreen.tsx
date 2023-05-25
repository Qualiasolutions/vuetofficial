import React from 'react';

import { StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PageTitle } from 'components/molecules/TextComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  useCreateUserInviteMutation,
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import RTKForm from 'components/forms/RTKForm';

import { deepCopy } from 'utils/copy';
import {
  familyMemberForm,
  FamilyMemberFormFieldTypes
} from 'screens/SettingsScreens/Forms/familyMemberFormFieldTypes';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';

const AddFamilyMemberScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'AddFamilyMember'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true,
      skip: !userDetails?.user_id
    }
  );

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const formFields = deepCopy<FamilyMemberFormFieldTypes>(familyMemberForm());

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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingTop: 100
  }
});

export default AddFamilyMemberScreen;

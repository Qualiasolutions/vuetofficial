import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabParamList } from 'types/base';

import {
  familyMemberForm,
  FamilyMemberFormFieldTypes
} from './familyMemberFormFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { deepCopy } from 'utils/copy';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useUpdateUserDetailsMutation
} from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import GenericError from 'components/molecules/GenericError';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useLayoutEffect } from 'react';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';

export default function EditFamilyMemberScreen({
  route,
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'EditFamilyMember'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();

  const {
    data: userFullDetails,
    isLoading,
    error
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const familyMemberIdRaw = route.params.id;
  const familyMemberId =
    typeof familyMemberIdRaw === 'number'
      ? familyMemberIdRaw
      : parseInt(familyMemberIdRaw);

  const familyMemberToEdit = userFullDetails?.family.users.filter(
    (familyMember) => familyMember.id === familyMemberId
  )[0];
  const fullName =
    familyMemberToEdit &&
    `${familyMemberToEdit.first_name} ${familyMemberToEdit.last_name}`;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('pageTitles.editFamilyMember', { fullName })
    });
  }, [userFullDetails]);

  const formFields = deepCopy<FamilyMemberFormFieldTypes>(familyMemberForm());

  if (isLoading || !userFullDetails || !route.params.id) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  if (route.params?.id && familyMemberToEdit) {
    let fieldName: keyof typeof formFields;
    for (fieldName in formFields) {
      if (fieldName in familyMemberToEdit) {
        formFields[fieldName].initialValue = familyMemberToEdit[fieldName];
      }
    }

    return (
      <TransparentFullPageScrollView>
        <TransparentPaddedView style={styles.formContainer}>
          <RTKForm
            fields={formFields}
            methodHooks={{
              PATCH: useUpdateUserDetailsMutation
            }}
            formType="UPDATE"
            extraFields={{ user_id: familyMemberToEdit.id }}
            onSubmitSuccess={() => {
              navigation.navigate('FamilySettings');
            }}
          />
        </TransparentPaddedView>
      </TransparentFullPageScrollView>
    );
  }

  return <FullPageSpinner />;
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 100
  }
});

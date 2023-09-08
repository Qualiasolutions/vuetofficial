import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabParamList } from 'types/base';

import {
  useFamilyMemberForm,
  FamilyMemberFormFieldTypes
} from './familyMemberFormFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { deepCopy } from 'utils/copy';
import { useUpdateUserDetailsMutation } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import GenericError from 'components/molecules/GenericError';
import { useLayoutEffect } from 'react';
import { TransparentView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 100
  }
});

export default function EditFamilyMemberScreen({
  route,
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'EditFamilyMember'>) {
  const { t } = useTranslation();
  const { data: userFullDetails } = useGetUserFullDetails();

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

  const formFields = deepCopy<FamilyMemberFormFieldTypes>(
    useFamilyMemberForm()
  );

  if (!userFullDetails || !route.params.id) {
    return null;
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
        <TransparentView style={styles.formContainer}>
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
        </TransparentView>
      </TransparentFullPageScrollView>
    );
  }

  return <FullPageSpinner />;
}

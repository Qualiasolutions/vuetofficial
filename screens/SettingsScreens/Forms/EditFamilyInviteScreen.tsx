import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import {
  familyMemberForm,
  FamilyMemberFormFieldTypes
} from './familyMemberFormFieldTypes';
import { formStyles } from 'screens/Forms/formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deepCopy } from 'utils/copy';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery,
  useUpdateUserDetailsMutation,
  useUpdateUserInviteMutation
} from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import GenericError from 'components/molecules/GenericError';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useUpdateFamilyDetailsMutation } from 'reduxStore/services/api/family';
import { useEffect } from 'react';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';

export default function EditEntityScreen({
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

  const { data: allUserInvites } = useGetUserInvitesQuery(
    userFullDetails?.family?.id || -1,
    {
      skip: !userFullDetails?.family?.id
    }
  );

  const familyInviteIdRaw = route.params.id;
  const familyInviteId =
    typeof familyInviteIdRaw === 'number'
      ? familyInviteIdRaw
      : parseInt(familyInviteIdRaw);

  const familyInviteToEdit = allUserInvites?.filter(
    (familyMember) => familyMember.id === familyInviteId
  )[0];
  const fullName =
    familyInviteToEdit &&
    `${familyInviteToEdit.first_name} ${familyInviteToEdit.last_name}`;

  useEffect(() => {
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

  if (route.params?.id && familyInviteToEdit) {
    let fieldName: keyof typeof formFields;
    for (fieldName in formFields) {
      if (fieldName in familyInviteToEdit) {
        formFields[fieldName].initialValue = familyInviteToEdit[fieldName];
      }
    }

    return (
      <AlmostWhiteContainerView>
        <RTKForm
          fields={formFields}
          methodHooks={{
            PATCH: useUpdateUserInviteMutation
          }}
          formType="UPDATE"
          extraFields={{ id: familyInviteToEdit.id }}
          onSubmitSuccess={() => {
            navigation.navigate('FamilySettings');
          }}
        />
      </AlmostWhiteContainerView>
    );
  }
  return null;
}

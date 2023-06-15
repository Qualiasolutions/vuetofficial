import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabParamList } from 'types/base';

import {
  useFamilyMemberForm,
  FamilyMemberFormFieldTypes
} from './familyMemberFormFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { deepCopy } from 'utils/copy';
import {
  useGetUserInvitesQuery,
  useUpdateUserInviteMutation
} from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import GenericError from 'components/molecules/GenericError';
import { useEffect } from 'react';
import { TransparentView } from 'components/molecules/ViewComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';

export default function EditEntityScreen({
  route,
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'EditFamilyMember'>) {
  const { t } = useTranslation();

  const { data: userFullDetails, isLoading, error } = useGetUserFullDetails();

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

  const formFields = deepCopy<FamilyMemberFormFieldTypes>(
    useFamilyMemberForm()
  );

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
      <TransparentFullPageScrollView>
        <TransparentView>
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
        </TransparentView>
      </TransparentFullPageScrollView>
    );
  }
  return null;
}

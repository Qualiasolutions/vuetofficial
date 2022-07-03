import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { familyMemberForm, FamilyMemberFormFieldTypes } from './familyMemberFormFieldTypes';
import { formStyles } from 'screens/Forms/formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deepCopy } from 'utils/copy';
import { useGetUserDetailsQuery, useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';
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
  
  const familyMemberIdRaw = route.params.id;
  const familyMemberId =
    typeof familyMemberIdRaw === 'number' ? familyMemberIdRaw : parseInt(familyMemberIdRaw);

  const familyMemberToEdit = userFullDetails?.family.users.filter(familyMember => familyMember.id === familyMemberId)[0];
  const fullName = familyMemberToEdit && `${familyMemberToEdit.first_name} ${familyMemberToEdit.last_name}`

  useEffect(() => {
    navigation.setOptions({title: t('pageTitles.editFamilyMember', { fullName })}) 
  }, [userFullDetails])
  
  const formFields = deepCopy<FamilyMemberFormFieldTypes>(familyMemberForm());

  if (isLoading || !userFullDetails || !route.params.id) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }


  if (route.params?.id && familyMemberToEdit) {
    let fieldName: keyof typeof formFields
    for (fieldName in formFields) {
      if (fieldName in familyMemberToEdit) {
        formFields[fieldName].initialValue = familyMemberToEdit[fieldName];
      }
    }

    return (
    //   <SafeAreaView>
        <AlmostWhiteContainerView>
          <RTKForm
            fields={formFields}
            methodHooks={{
              PATCH: useUpdateFamilyDetailsMutation,
            //   DELETE: useDeleteEntityMutation
            }}
            formType="UPDATE"
            extraFields={{ id: familyMemberToEdit.id }}
          />
        </AlmostWhiteContainerView>
    //   </SafeAreaView>
    );
  }
  return null;
}

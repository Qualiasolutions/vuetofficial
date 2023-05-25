import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingsTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  TransparentContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
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
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { friendForm, FriendFormFieldTypes } from './friendFormFieldTypes';
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { Button } from 'components/molecules/ButtonComponents';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { isFieldErrorCodeError, isInvalidPhoneNumberError } from 'types/signup';

const CreateUserInviteScreen = ({
  navigation,
  route
}: NativeStackScreenProps<SettingsTabParamList, 'CreateUserInvite'>) => {
  const isFamilyRequest = route.params?.familyRequest;
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const [phoneNumber, setPhoneNumber] = useState('');
  const {
    data: userFullDetails,
    isLoading,
    error
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const [createUserInvite, createUserInviteResult] =
    useCreateUserInviteMutation();

  const { t } = useTranslation();

  if (!userFullDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentContainerView>
        <PhoneNumberInput
          value={phoneNumber}
          onChangeFormattedText={setPhoneNumber}
          containerStyle={{ marginBottom: 30 }}
        />
        <Button
          title={t('common.invite')}
          disabled={!(phoneNumber.length > 10)}
          onPress={async () => {
            try {
              await createUserInvite({
                invitee: userFullDetails.id,
                family: isFamilyRequest ? userFullDetails.family.id : null,
                phone_number: phoneNumber
              }).unwrap();
              Toast.show({
                type: 'success',
                text1: t('screens.createUserInvite.success')
              });
              if (isFamilyRequest) {
                navigation.navigate('FamilySettings');
              } else {
                navigation.navigate('FriendSettings');
              }
            } catch (err) {
              console.log(err);
              if (isInvalidPhoneNumberError(err)) {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.invalidPhone')
                });
              } else if (
                isFieldErrorCodeError('phone_number', 'already_has_family')(err)
              ) {
                Toast.show({
                  type: 'error',
                  text1: t('screens.createUserInvite.errors.alreadyHasFamily')
                });
              } else if (
                isFieldErrorCodeError('phone_number', 'already_in_family')(err)
              ) {
                Toast.show({
                  type: 'error',
                  text1: t('screens.createUserInvite.errors.alreadyInFamily')
                });
              } else if (
                isFieldErrorCodeError('phone_number', 'already_invited')(err)
              ) {
                Toast.show({
                  type: 'error',
                  text1: t('screens.createUserInvite.errors.alreadyInvited')
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }
          }}
        />
        {/* <RTKForm
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
            setErrorMessage(t('common.errors.generic'));
          }}
          extraFields={extraFields}
        /> */}
      </TransparentContainerView>
    </TransparentFullPageScrollView>
  );
};

export default CreateUserInviteScreen;

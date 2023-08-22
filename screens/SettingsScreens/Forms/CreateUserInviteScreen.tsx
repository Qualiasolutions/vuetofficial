import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingsTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  TransparentContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';

import { useCreateUserInviteMutation } from 'reduxStore/services/api/user';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { Button } from 'components/molecules/ButtonComponents';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import { isFieldErrorCodeError, isInvalidPhoneNumberError } from 'types/signup';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { StyleSheet } from 'react-native';
import SafePressable from 'components/molecules/SafePressable';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TextInput } from 'components/Themed';
import * as EmailValidator from 'email-validator';
import { CreateUserInviteRequest } from 'types/users';

const styles = StyleSheet.create({
  otherOptsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  button: { marginTop: 10 },
  container: { justifyContent: 'flex-start' },
  emailTextInput: { width: '100%' }
});

const CreateUserInviteScreen = ({
  navigation,
  route
}: NativeStackScreenProps<SettingsTabParamList, 'CreateUserInvite'>) => {
  const isFamilyRequest = route.params?.familyRequest;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [usingEmail, setUsingEmail] = useState(false);
  const { data: userFullDetails, isLoading } = useGetUserFullDetails();

  const [createUserInvite, createUserInviteResult] =
    useCreateUserInviteMutation();

  const { t } = useTranslation();

  if (isLoading || !userFullDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentContainerView style={styles.container}>
        {usingEmail ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.emailTextInput}
            placeholder={t('common.emailAddress')}
          />
        ) : (
          <PhoneNumberInput
            value={phoneNumber}
            onChangeFormattedText={setPhoneNumber}
          />
        )}
        <TransparentView style={styles.otherOptsWrapper}>
          <SafePressable onPress={() => setUsingEmail(!usingEmail)}>
            <PrimaryText
              text={
                usingEmail
                  ? t('screens.logIn.usePhone')
                  : t('screens.logIn.useEmail')
              }
            />
          </SafePressable>
        </TransparentView>
        {createUserInviteResult.isLoading ? (
          <PaddedSpinner />
        ) : (
          <Button
            style={styles.button}
            title={t('common.invite')}
            disabled={
              (usingEmail && !EmailValidator.validate(email)) ||
              (!usingEmail && phoneNumber.length < 9)
            }
            onPress={async () => {
              try {
                const req: CreateUserInviteRequest = {
                  invitee: userFullDetails.id,
                  family: isFamilyRequest ? userFullDetails.family.id : null
                };

                if (usingEmail) {
                  req.email = email;
                } else {
                  req.phone_number = phoneNumber;
                }
                await createUserInvite(req).unwrap();
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
                  isFieldErrorCodeError(
                    'phone_number',
                    'already_has_family'
                  )(err)
                ) {
                  Toast.show({
                    type: 'error',
                    text1: t('screens.createUserInvite.errors.alreadyHasFamily')
                  });
                } else if (
                  isFieldErrorCodeError(
                    'phone_number',
                    'already_in_family'
                  )(err)
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
        )}
      </TransparentContainerView>
    </TransparentFullPageScrollView>
  );
};

export default CreateUserInviteScreen;

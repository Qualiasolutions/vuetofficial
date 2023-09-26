import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SafePressable from 'components/molecules/SafePressable';
import { StyleSheet } from 'react-native';

import {
  PageSubtitle,
  PageTitle,
  PrimaryText
} from 'components/molecules/TextComponents';
import {
  AlmostWhiteContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnauthorisedTabParamList } from 'types/base';
import { TextInput } from 'components/Themed';
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { Button } from 'components/molecules/ButtonComponents';
import { validate } from 'email-validator';
import {
  useCreatePasswordResetCodeMutation,
  useValidatePasswordResetCodeMutation
} from 'reduxStore/services/api/auth';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ValidationCodeInput from 'components/molecules/ValidationCodeInput';
import { useSecureUpdateUserDetailsMutation } from 'reduxStore/services/api/user';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  },
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  inputLabel: {
    fontSize: 12,
    textAlign: 'left'
  },
  confirmButton: {
    marginTop: 15,
    marginBottom: 15
  },
  passwordInput: { marginBottom: 10 },
  otherOptsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  usernameInput: { marginBottom: 10, width: '100%' }
});

export default function ForgotPasswordScreen({
  navigation,
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'ForgotPassword'>) {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState(-1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConf, setNewPasswordConf] = useState<string>('');
  const [usingEmail, setUsingEmail] = useState<boolean>(
    !!route.params.useEmail
  );
  const [step, setStep] = useState('USERNAME');

  const [createPasswordResetCode, createPasswordResetCodeResult] =
    useCreatePasswordResetCodeMutation();

  const [validatePasswordResetCode] = useValidatePasswordResetCodeMutation();

  const [updateUserDetails, updateUserDetailsResult] =
    useSecureUpdateUserDetailsMutation();

  return (
    <AlmostWhiteContainerView style={styles.container}>
      <PageTitle text={t('screens.forgotPassword.title')} />
      {step === 'NEW_PASSWORD' && (
        <>
          <PageSubtitle text={t('screens.forgotPassword.newPassword')} />
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t('screens.editSecurity.newPassword')}
            style={styles.passwordInput}
            secureTextEntry={true}
          />
          <TextInput
            value={newPasswordConf}
            onChangeText={setNewPasswordConf}
            placeholder={t('screens.editSecurity.newPasswordConf')}
            style={styles.passwordInput}
            secureTextEntry={true}
          />
          {updateUserDetailsResult.isLoading ? (
            <PaddedSpinner />
          ) : (
            <Button
              title={t('common.update')}
              style={styles.confirmButton}
              onPress={async () => {
                try {
                  await updateUserDetails({
                    user_id: userId,
                    password: newPassword,
                    reset_password_code: code
                  }).unwrap();
                  Toast.show({
                    type: 'success',
                    text1: t('screens.editSecurity.passwordSuccess')
                  });
                  navigation.navigate('Login');
                } catch (err) {
                  Toast.show({
                    type: 'error',
                    text1: t('common.errors.generic')
                  });
                }
              }}
            />
          )}
        </>
      )}
      {step === 'CODE' && (
        <>
          <ValidationCodeInput
            validationId={-1}
            isEmail={usingEmail}
            onVerify={async (validationCode) => {
              const body = usingEmail
                ? { email: username, code: validationCode }
                : { phone_number: username, code: validationCode };
              const res = await validatePasswordResetCode(body).unwrap();

              setUserId(res.user);
              setCode(validationCode);
            }}
            onResend={() => {
              const body = usingEmail
                ? { email: username }
                : { phone_number: username };
              createPasswordResetCode(body)
                .unwrap()
                .catch(() => {
                  Toast.show({
                    type: 'error',
                    text1: t('common.errors.generic')
                  });
                });
            }}
            onSuccess={() => {
              setStep('NEW_PASSWORD');
            }}
            onError={() => {
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }}
          />
        </>
      )}
      {step === 'USERNAME' && (
        <>
          <PageSubtitle
            text={
              usingEmail
                ? t('screens.forgotPassword.enterEmail')
                : t('screens.forgotPassword.enterPhone')
            }
          />
          <TransparentView style={styles.usernameInput}>
            {usingEmail ? (
              <TextInput
                value={username}
                onChangeText={(newUsername) => {
                  setUsername(newUsername);
                }}
              />
            ) : (
              <PhoneNumberInput
                onChangeFormattedText={(newUsername) => {
                  setUsername(newUsername);
                }}
              />
            )}
          </TransparentView>
          <TransparentView style={styles.otherOptsWrapper}>
            <SafePressable
              onPress={() => {
                setUsingEmail(!usingEmail);
                setUsername('');
              }}
            >
              <PrimaryText
                text={
                  usingEmail
                    ? t('screens.logIn.usePhone')
                    : t('screens.logIn.useEmail')
                }
              />
            </SafePressable>
          </TransparentView>
          {createPasswordResetCodeResult.isLoading ? (
            <PaddedSpinner spinnerColor="buttonDefault" />
          ) : (
            <Button
              title={t('screens.forgotPassword.reset')}
              onPress={() => {
                const body = usingEmail
                  ? { email: username }
                  : { phone_number: username };
                createPasswordResetCode(body)
                  .unwrap()
                  .then(() => {
                    setStep('CODE');
                  })
                  .catch(() => {
                    Toast.show({
                      type: 'error',
                      text1: t('common.errors.generic')
                    });
                  });
              }}
              disabled={
                (usingEmail && !validate(username)) ||
                (!usingEmail && username.length < 10)
              }
              style={styles.confirmButton}
            />
          )}
        </>
      )}
      <SafePressable
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <PrimaryText text={t('screens.forgotPassword.logIn')} bold={true} />
      </SafePressable>
    </AlmostWhiteContainerView>
  );
}

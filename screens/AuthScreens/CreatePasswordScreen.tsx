import React, { useEffect } from 'react';

import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { UnauthorisedTabParamList } from 'types/base';
import { useCreateAccountMutation } from 'reduxStore/services/api/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import {
  setAccessToken,
  setRefreshToken
} from 'reduxStore/slices/auth/actions';
import {
  PageTitle,
  PageSubtitle,
  AlmostBlackText
} from 'components/molecules/TextComponents';
import {
  AlmostWhiteContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RegisterAccountRequest } from 'types/signup';

const ENV = Constants.manifest?.extra?.processEnv;

const styles = StyleSheet.create({
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
    marginTop: 30,
    marginBottom: 15
  }
});

const CreatePasswordScreen = ({
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'CreatePassword'>) => {
  console.log('CreatePasswordScreen');
  const [password, onChangePassword] = React.useState<string>('');
  const [passwordConfirm, onChangePasswordConfirm] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const { t } = useTranslation();

  const [createAccount, createAccountResult] = useCreateAccountMutation();

  const dispatch = useDispatch();

  const { isEmail, phoneNumber } = route.params;

  useEffect(() => {
    if (createAccountResult.isSuccess) {
      const { access_token: accessToken, refresh_token: refreshToken } =
        createAccountResult.data;

      dispatch(setAccessToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
    } else {
      if (createAccountResult.error) {
        Toast.show({
          type: 'error',
          text1: t('common.errors.generic')
        });
      }
    }
  }, [createAccountResult, dispatch, t]);

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage} />
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.createPassword.title')} />
      <PageSubtitle text={t('screens.createPassword.addPassword')} />
      {errorContent}
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.createPassword.password')}
        />
      </TransparentView>
      <TextInput
        accessibilityLabel="password-input"
        value={password}
        onChangeText={(text) => onChangePassword(text)}
        secureTextEntry={true}
      />
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.createPassword.confirmPassword')}
        />
      </TransparentView>
      <TextInput
        accessibilityLabel="password-input-confirmation"
        value={passwordConfirm}
        onChangeText={(text) => onChangePasswordConfirm(text)}
        secureTextEntry={true}
      />
      <Button
        title={t('common.verify')}
        onPress={() => {
          const minimumPasswordLength = ENV === 'PROD' ? 8 : 2;
          if (password.length < minimumPasswordLength) {
            setErrorMessage(
              t('screens.createPassword.passwordTooShort', {
                minimumLength: minimumPasswordLength
              })
            );
          } else if (password !== passwordConfirm) {
            Toast.show({
              type: 'error',
              text1: t('common.errors.passwordsDontMatch')
            });
          } else {
            const req: RegisterAccountRequest = {
              password,
              password2: passwordConfirm
            };
            if (isEmail) {
              req.email = phoneNumber;
            } else {
              req.phone_number = phoneNumber;
            }
            createAccount(req);
          }
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

export default CreatePasswordScreen;

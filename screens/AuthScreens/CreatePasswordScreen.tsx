import React, { useEffect } from 'react';

import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { UnauthorisedTabParamList } from 'types/base';
import {
  useCreateAccountMutation,
  useCreatePhoneValidationMutation,
} from 'reduxStore/services/api/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import {
  setAccessToken,
  setRefreshToken,
  setUsername
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

const ENV = Constants.manifest?.extra?.processEnv;

const CreatePasswordScreen = ({
  navigation,
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'CreatePassword'>) => {
  const [password, onChangePassword] = React.useState<string>('');
  const [passwordConfirm, onChangePasswordConfirm] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const [createPhoneValidation, createValidationResult] =
    useCreatePhoneValidationMutation();
  const [createAccount, createAccountResult] = useCreateAccountMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (createAccountResult.isSuccess) {
      const { access_token, refresh_token, phone_number } =
        createAccountResult.data;

      dispatch(setAccessToken(access_token));
      dispatch(setRefreshToken(refresh_token));
      dispatch(setUsername(phone_number));
    } else {
      if (createAccountResult.error) {
        setErrorMessage(t('common.genericError'));
      }
    }
  }, [createAccountResult]);

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
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
            setErrorMessage(t('screens.createPassword.passwordsDontMatch'));
          } else {
            createAccount({
              password,
              password2: passwordConfirm,
              phone_number: route.params.phoneNumber
            });
          }
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

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

export default CreatePasswordScreen;

import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, View, TextInput, Button } from 'components/Themed';

import GLOBAL_STYLES from 'globalStyles/styles';

import { UnauthorisedTabParamList } from 'types/base';
import { useCreateAccountMutation, useCreatePhoneValidationMutation, useUpdatePhoneValidationMutation } from 'reduxStore/services/api/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken, setUsername } from 'reduxStore/slices/auth/actions';

const ENV = Constants.manifest?.extra?.processEnv;

const CreatePasswordScreen = ({ navigation, route }: NativeStackScreenProps<UnauthorisedTabParamList, 'CreatePassword'> ) => {
  const [password, onChangePassword] = React.useState<string>('');
  const [passwordConfirm, onChangePasswordConfirm] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const [createPhoneValidation, createValidationResult] = useCreatePhoneValidationMutation()
  const [createAccount, createAccountResult] = useCreateAccountMutation()

  const dispatch = useDispatch()

  useEffect(() => {
    if (createAccountResult.isSuccess) {
      const {access_token, refresh_token, phone_number} = createAccountResult.data

      dispatch(setAccessToken(access_token));
      dispatch(setRefreshToken(refresh_token));
      dispatch(setUsername(phone_number));
    } else {
      if (createAccountResult.error) {
        setErrorMessage(t('common.genericError'))
      }
    }
  }, [createAccountResult])

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <View>
      <Text style={GLOBAL_STYLES.errorMessage}>{errorMessage}</Text>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <Text
        darkColor="#AC3201"
        lightColor="#AC3201"
        style={styles.header}
      >{t('screens.createPassword.title')}</Text>
      <Text style={styles.subheader}>{t('screens.createPassword.addPassword')}</Text>
      {errorContent}
      <View style={styles.inputLabelWrapper}>
        <Text style={styles.inputLabel}>{t('screens.createPassword.password')}</Text>
      </View>
      <TextInput
        value={password}
        onChangeText={(text) => onChangePassword(text)}
        secureTextEntry={true}
      />
      <View style={styles.inputLabelWrapper}>
        <Text style={styles.inputLabel}>{t('screens.createPassword.confirmPassword')}</Text>
      </View>
      <TextInput
        value={passwordConfirm}
        onChangeText={(text) => onChangePasswordConfirm(text)}
        secureTextEntry={true}
      />
      <Button
        title={t('common.verify')}
        onPress={() => {
          const minimumPasswordLength = ENV === "PROD" ? 8 : 2
          if (password.length < minimumPasswordLength) {
            setErrorMessage(t('screens.createPassword.passwordTooShort', { minimumLength: minimumPasswordLength }))
          } else if (password !== passwordConfirm) {
            setErrorMessage(t('screens.createPassword.passwordsDontMatch'))
          } else {
            createAccount({
              password,
              password2: passwordConfirm,
              phone_number: route.params.phoneNumber
            })
          }
        }}
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#EFEFEF'
  },
  header: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  subheader: {
    fontSize: 14,
    color: "#707070",
    marginBottom: 20,
  },
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#EFEFEF'
  },
  inputLabel: {
    fontSize: 12,
    color: "#707070",
    textAlign: 'left'
  },
  confirmButton: {
    marginTop: 30,
    marginBottom: 15,
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: '#EFEFEF'
  },
  forgotPassword: {
    fontWeight: "bold"
  },
  signUp: {
    fontWeight: 'bold'
  }
});

export default CreatePasswordScreen;

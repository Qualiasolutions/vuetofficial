import React from 'react';

import { Pressable, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from 'reduxStore/slices/auth/actions';

import { Text, View, TextInput, Button } from 'components/Themed';

import { getTokenAsync } from 'utils/authRequests';

import GLOBAL_STYLES from 'globalStyles/styles';

import { useGetUserDetailsQuery } from 'reduxStore/services/api/api';
import { UnauthorisedTabScreenProps } from 'types/base';

const LoginScreen = ({ navigation }: UnauthorisedTabScreenProps<'Login'> ) => {
  const [username, onChangeUsername] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { refetch: refetchUserDetails } = useGetUserDetailsQuery();

  const setTokenAsync = async (
    usernameToUse: string,
    passwordToUse: string
  ) => {
    setErrorMessage('');
    await getTokenAsync(usernameToUse, passwordToUse)
      .then(({ access, refresh }) => {
        if (access) {
          dispatch(setAccessToken(access));
          dispatch(setRefreshToken(refresh));
          dispatch(setUsername(usernameToUse));

          refetchUserDetails();
        } else {
          setErrorMessage(
            'Failed to log in. Please check that you have entered your credentials correctly'
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(
          'Failed to log in. Please check that you have entered your credentials correctly'
        );
      });
  };

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
    >{t('screens.signUp.welcome')}</Text>
      <Text style={styles.subheader}>{t('screens.signUp.usePhoneNumber')}</Text>
      {errorContent}
      <View style={styles.inputLabelWrapper}>
        <Text style={styles.inputLabel}>{t('screens.logIn.phoneNumber')}</Text>
      </View>
      <TextInput
        value={username}
        onChangeText={(text) => onChangeUsername(text)}
      />
      <Button
        title={t('common.confirm')}
        onPress={() => {}}
        style={styles.confirmButton}
      />
      <Text>{t('screens.signUp.alreadyHaveAccount')}</Text>
      <Pressable onPress={() => {
        navigation.navigate('Login')}}>
      <Text
        lightColor="#AC3201"
        darkColor="#AC3201"
        style={styles.signUp}
      >{t('screens.signUp.logIn')}</Text>
        </Pressable>
    </View>
  );
};

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

export default LoginScreen;

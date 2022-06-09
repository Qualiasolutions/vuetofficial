import React from 'react';

import { StyleSheet, TextInput, Button, Image } from 'react-native';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from '../reduxStore/slices/auth/actions';

import { Text, View } from '../components/Themed';

import { getTokenAsync } from '../utils/authRequests';

import GLOBAL_STYLES from '../globalStyles/styles';
import { SUCCESS } from '../globalStyles/colorScheme';

import { useGetUserDetailsQuery } from 'reduxStore/services/api/api';

const logo = require('../assets/images/logo.png');

const LoginScreen = () => {
  const [username, onChangeUsername] = React.useState<string>('');
  const [password, onChangePassword] = React.useState<string>('');
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
      <Image source={logo} style={styles.logo} />
      {errorContent}
      <TextInput
        value={username}
        onChangeText={(text) => onChangeUsername(text)}
        style={GLOBAL_STYLES.textInput}
        placeholder={t('screens.logIn.username')}
      />
      <TextInput
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => onChangePassword(text)}
        style={GLOBAL_STYLES.textInput}
        placeholder={t('screens.logIn.password')}
      />
      <View style={styles.loginButtonWrapper}>
        <Button
          title={t('screens.logIn.logInText')}
          onPress={() => setTokenAsync(username, password)}
          color={SUCCESS}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    aspectRatio: 1
  },
  loginButtonWrapper: {
    marginTop: 30
  }
});

export default LoginScreen;

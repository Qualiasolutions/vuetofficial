import React from 'react';

import { StyleSheet, TextInput, Button, Image } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAccessToken, setRefreshToken, setUsername } from '../reduxStore/slices/auth/actions';

import { AuthReducerActionType } from '../reduxStore/slices/auth/types';
import type { Dispatch } from '@reduxjs/toolkit';

import { Text, View } from '../components/Themed';

import { getTokenAsync } from '../utils/authRequests';

import GLOBAL_STYLES from '../globalStyles/styles';
import { SUCCESS } from '../globalStyles/colorScheme';

const logo = require('../assets/images/logo.png');

interface LoginProps {
  setAccessTokenProp: Function;
  setRefreshTokenProp: Function;
  setUsernameProp: Function;
}

const LoginScreen = ({
  setAccessTokenProp,
  setRefreshTokenProp,
  setUsernameProp
}: LoginProps) => {
  const [username, onChangeUsername] = React.useState<string>('');
  const [password, onChangePassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const setTokenAsync = async (
    usernameToUse: string,
    passwordToUse: string
  ) => {
    setErrorMessage('');
    await getTokenAsync(usernameToUse, passwordToUse).then(
      ({ access, refresh }) => {
        if (access) {
          setAccessTokenProp(access);
          setRefreshTokenProp(refresh);
          setUsernameProp(usernameToUse);
        } else {
          setErrorMessage(
            'Failed to log in. Please check that you have entered your credentials correctly'
          );
        }
      }
    );
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
        placeholder="Username"
      />
      <TextInput
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => onChangePassword(text)}
        style={GLOBAL_STYLES.textInput}
        placeholder="Password"
      />
      <View style={styles.loginButtonWrapper}>
        <Button
          title="Log In"
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

const mapDispatchToProps = (dispatch: Dispatch<AuthReducerActionType>) => {
  return bindActionCreators(
    {
      setAccessTokenProp: setAccessToken,
      setRefreshTokenProp: setRefreshToken,
      setUsernameProp: setUsername
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(LoginScreen);

import React from 'react';

import { StyleSheet, TextInput, Button } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setAccessToken, setRefreshToken, setUsername } from '../redux/actions';

import { EntireState, AuthReducerActionType } from '../redux/types';
import type { Dispatch } from '@reduxjs/toolkit';

import Constants from 'expo-constants';
import { Text, View } from '../components/Themed';

import { RootStackScreenProps } from '../types';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type LoginResponse = {
  access: string;
  refresh: string;
};

const getTokenAsync = async (username: string, password: string) => {
  const loginResponse: LoginResponse = await fetch(`http://${vuetApiUrl}/auth/token/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
    });

  return loginResponse
};

// TODO - the typing needs a good look at
interface LoginProps extends RootStackScreenProps<'Login'> {
  setAccessTokenProp: Function;
  setRefreshTokenProp: Function;
  setUsernameProp: Function;
}

const LoginScreen = ({
  navigation,
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
          navigation.navigate('Root');
        } else {
          setErrorMessage(
            'Failed to log in. Please check that you have entered your credentials correctly'
          );
        }
      }
    );
  };

  const errorContent = errorMessage ? (
    // TODO - add generic error message styling
    // <View style={{...ERROR_MESSAGE_STYLE, ...styles.errorMessage}}>
    <View>
      <Text> {errorMessage} </Text>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login: {Constants.manifest?.extra?.vuetApiUrl}{' '}
      </Text>
      <TextInput
        value={username}
        onChangeText={(text) => onChangeUsername(text)}
        // style={styles.textInput} TODO
        placeholder="Username"
        // placeholderTextColor={LIGHT + '66'} TODO
      />
      <TextInput
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => onChangePassword(text)}
        // style={styles.textInput} TODO
        placeholder="Password"
        // placeholderTextColor={LIGHT + '66'} TODO
      />
      {/* </View><View style={styles.buttonWrapper}> TODO */}
      <View>
        <Button
          title="Log In"
          onPress={() => setTokenAsync(username, password)}
          // color={PRIMARY} TODO
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
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

const mapStateToProps = (state: EntireState) => ({
  jwtAccessToken: state.authentication.jwtAccessToken,
  jwtRefreshToken: state.authentication.jwtRefreshToken,
  username: state.authentication.username
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
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

import React, { useRef } from 'react';

import { Pressable, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from 'reduxStore/slices/auth/actions';

import { Text, TextInput, Button } from 'components/Themed';

import { getTokenAsync } from 'utils/authRequests';

import { UnauthorisedTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  PageTitle,
  PageSubtitle,
  PrimaryText,
  AlmostBlackText
} from 'components/molecules/TextComponents';
import {
  AlmostWhiteContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';

const LoginScreen = ({
  navigation
}: NativeStackScreenProps<UnauthorisedTabParamList, 'Login'>) => {
  const [username, onChangeUsername] = React.useState<string>('');
  const [password, onChangePassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { t } = useTranslation();

  const dispatch = useDispatch();

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
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.logIn.welcomeBack')} />
      <PageSubtitle text={t('screens.logIn.enterNumber')} />
      {errorContent}
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.logIn.phoneNumber')}
        />
      </TransparentView>
      <PhoneNumberInput
        onChangeFormattedText={(username) => {
          onChangeUsername(username);
        }}
      />
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.logIn.password')}
        />
      </TransparentView>
      <TextInput
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => onChangePassword(text)}
      />
      <TransparentView style={styles.forgotPasswordWrapper}>
        <PrimaryText
          style={styles.forgotPassword}
          text={t('screens.logIn.forgotPassword')}
        />
      </TransparentView>
      <Button
        title={t('common.confirm')}
        onPress={() => setTokenAsync(username, password)}
        style={styles.confirmButton}
      />
      <Text>{t('screens.logIn.dontHaveAccount')}</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('Signup');
        }}
      >
        <PrimaryText style={styles.signUp} text={t('screens.logIn.signUp')} />
      </Pressable>
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
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%'
  },
  forgotPassword: {
    fontWeight: 'bold'
  },
  signUp: {
    fontWeight: 'bold'
  }
});

export default LoginScreen;

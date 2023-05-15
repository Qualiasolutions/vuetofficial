import React, { useRef } from 'react';

import { Pressable, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from 'reduxStore/slices/auth/actions';

import { Text, TextInput } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

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
import { PaddedSpinner } from 'components/molecules/Spinners';

const LoginScreen = ({
  navigation
}: NativeStackScreenProps<UnauthorisedTabParamList, 'Login'>) => {
  const [username, onChangeUsername] = React.useState<string>('');
  const [password, onChangePassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const setTokenAsync = async (
    usernameToUse: string,
    passwordToUse: string
  ) => {
    setErrorMessage('');
    try {
      const { access, refresh } = await getTokenAsync(
        usernameToUse,
        passwordToUse
      );
      if (access) {
        dispatch(setAccessToken(access));
        dispatch(setRefreshToken(refresh));
        dispatch(setUsername(usernameToUse));
      } else {
        setErrorMessage(t('screens.logIn.failedLogin'));
        setSubmitting(false);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(t('screens.logIn.failedLogin'));
      setSubmitting(false);
    }
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
        containerStyle={{ height: 50 }}
        textInputStyle={{
          height: 50
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
        <PrimaryText text={t('screens.logIn.forgotPassword')} bold={true} />
      </TransparentView>
      {submitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" />
      ) : (
        <Button
          title={t('common.confirm')}
          onPress={() => {
            setSubmitting(true);
            setTokenAsync(username, password);
          }}
          style={styles.confirmButton}
        />
      )}
      <Text>{t('screens.logIn.dontHaveAccount')}</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('Signup');
        }}
      >
        <PrimaryText text={t('screens.logIn.signUp')} bold={true} />
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
  }
});

export default LoginScreen;

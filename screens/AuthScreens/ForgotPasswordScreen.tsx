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
    marginTop: 15,
    marginBottom: 15
  },
  otherOptsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  usernameInput: { marginBottom: 10, width: '100%' }
});

export default function ForgotPasswordScreen({
  navigation
}: NativeStackScreenProps<UnauthorisedTabParamList, 'ForgotPassword'>) {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>('');
  const [usingEmail, setUsingEmail] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.forgotPassword.title')} />
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
      {submitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" />
      ) : (
        <Button
          title={t('screens.forgotPassword.reset')}
          onPress={() => {
            setSubmitting(true);
          }}
          style={styles.confirmButton}
        />
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

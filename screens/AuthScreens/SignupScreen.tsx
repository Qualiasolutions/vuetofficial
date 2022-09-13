import React, { useEffect, useRef } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Button } from 'components/Themed';

import { UnauthorisedTabParamList } from 'types/base';
import { useCreatePhoneValidationMutation } from 'reduxStore/services/api/signup';
import { isFieldErrorCodeError, isInvalidPhoneNumberError } from 'types/signup';
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

const SignupScreen = ({
  navigation
}: NativeStackScreenProps<UnauthorisedTabParamList, 'Signup'>) => {
  const [phoneNumber, onChangePhoneNumber] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const [createPhoneValidation, result] = useCreatePhoneValidationMutation();

  const { t } = useTranslation();

  useEffect(() => {
    if (result.isSuccess) {
      navigation.navigate('ValidatePhone', {
        validationId: result.data.id,
        phoneNumber: result.data.phone_number
      });
    } else {
      if (result.error) {
        if (
          isFieldErrorCodeError(
            'phone_number',
            'phone_number_used'
          )(result.error)
        ) {
          setErrorMessage(t('screens.signUp.phoneUsedError'));
        } else if (isInvalidPhoneNumberError(result.error)) {
          setErrorMessage(t('screens.signUp.phoneInvalidError'));
        } else {
          setErrorMessage(t('common.genericError'));
        }
      }
    }
  }, [result]);

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.signUp.welcome')} />
      <PageSubtitle text={t('screens.signUp.usePhoneNumber')} />
      {errorContent}
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.signUp.phoneNumber')}
        />
      </TransparentView>
      <PhoneNumberInput
        onChangeFormattedText={(text) => {
          onChangePhoneNumber(text);
        }}
      />
      <Button
        title={t('common.confirm')}
        onPress={() => {
          createPhoneValidation({ phone_number: phoneNumber });
        }}
        style={styles.confirmButton}
      />
      <Text>{t('screens.signUp.alreadyHaveAccount')}</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <PrimaryText text={t('screens.signUp.logIn')} bold={true} />
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
  }
});

export default SignupScreen;

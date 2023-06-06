import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

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
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

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

const SignupScreen = ({
  navigation
}: NativeStackScreenProps<UnauthorisedTabParamList, 'Signup'>) => {
  const [phoneNumber, onChangePhoneNumber] = React.useState<string>('');

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
          Toast.show({
            type: 'error',
            text1: t('common.errors.phoneUsedError')
          });
        } else if (isInvalidPhoneNumberError(result.error)) {
          Toast.show({
            type: 'error',
            text1: t('common.errors.invalidPhone')
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('common.errors.generic')
          });
        }
      }
    }
  }, [result, navigation, t]);

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.signUp.welcome')} />
      <PageSubtitle text={t('screens.signUp.usePhoneNumber')} />
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
      <SafePressable
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <PrimaryText text={t('screens.signUp.logIn')} bold={true} />
      </SafePressable>
    </AlmostWhiteContainerView>
  );
};

export default SignupScreen;

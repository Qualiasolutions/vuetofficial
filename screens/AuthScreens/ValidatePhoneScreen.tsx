import React from 'react';

import { useTranslation } from 'react-i18next';

import { UnauthorisedTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isFieldErrorCodeError } from 'types/signup';
import { PageTitle } from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import ValidationCodeInput from 'components/molecules/ValidationCodeInput';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const ValidatePhoneScreen = ({
  navigation,
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'ValidatePhone'>) => {
  const { t } = useTranslation();
  const { validationId, phoneNumber, isEmail } = route?.params;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.validatePhone.title')} />
      <ValidationCodeInput
        validationId={validationId}
        phoneNumber={phoneNumber}
        isEmail={isEmail}
        onSuccess={() => {
          navigation.navigate('CreatePassword', {
            phoneNumber: phoneNumber,
            isEmail
          });
        }}
        onError={(err) => {
          if (isFieldErrorCodeError('code', 'invalid_code')(err)) {
            Toast.show({
              type: 'error',
              text1: t('common.errors.invalidCodeError')
            });
          } else {
            Toast.show({
              type: 'error',
              text1: t('common.errors.generic')
            });
          }
        }}
      />
    </AlmostWhiteContainerView>
  );
};

export default ValidatePhoneScreen;

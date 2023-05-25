import React from 'react';

import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'components/Themed';

import { UnauthorisedTabParamList } from 'types/base';
import { useCreatePhoneValidationMutation } from 'reduxStore/services/api/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isFieldErrorCodeError } from 'types/signup';
import {
  PageTitle,
  PageSubtitle,
  PrimaryText
} from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import ValidationCodeInput from 'components/molecules/ValidationCodeInput';

const ValidatePhoneScreen = ({
  navigation,
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'ValidatePhone'>) => {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [createPhoneValidation, createPhoneResult] =
    useCreatePhoneValidationMutation();

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage} />
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.validatePhone.title')} />
      {errorContent}
      <ValidationCodeInput
        validationId={route?.params?.validationId}
        phoneNumber={route?.params?.phoneNumber}
        onSuccess={() => {
          navigation.navigate('CreatePassword', {
            phoneNumber: route.params.phoneNumber
          });
        }}
        onError={(err) => {
          if (isFieldErrorCodeError('code', 'invalid_code')(err)) {
            setErrorMessage(t('screens.validatePhone.invalidCodeError'));
          } else {
            setErrorMessage(t('common.errors.generic'));
          }
        }}
      />
    </AlmostWhiteContainerView>
  );
};

export default ValidatePhoneScreen;

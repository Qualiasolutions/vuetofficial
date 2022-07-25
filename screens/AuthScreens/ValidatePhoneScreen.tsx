import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text,  Button } from 'components/Themed';

import { UnauthorisedTabParamList } from 'types/base';
import {
  useCreatePhoneValidationMutation,
  useUpdatePhoneValidationMutation
} from 'reduxStore/services/api/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isFieldErrorCodeError } from 'types/signup';
import {
  PageTitle,
  PageSubtitle,
  PrimaryText,
} from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import CodeInput from 'react-native-code-input';

const ValidatePhoneScreen = ({
  navigation,
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'ValidatePhone'>) => {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [updatePhoneValidation, result] = useUpdatePhoneValidationMutation();
  const [createPhoneValidation, createPhoneResult] =
    useCreatePhoneValidationMutation();

  const { t } = useTranslation();

  useEffect(() => {
    if (result.isSuccess) {
      navigation.navigate('CreatePassword', {
        phoneNumber: route.params.phoneNumber
      });
    } else {
      if (result.error) {
        if (isFieldErrorCodeError('code', 'invalid_code')) {
          setErrorMessage(t('screens.validatePhone.invalidCodeError'));
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
      <PageTitle text={t('screens.validatePhone.title')} />
      <PageSubtitle text={t('screens.validatePhone.enterCode')} />
      {errorContent}
      <CodeInput
        space={10}
        size={50}
        keyboardType="numeric"
        codeLength={6}
        autoFocus={true}
        inputPosition="center"
        onFulfill={(code: any) => onChangeValidationCode(code)}
        activeColor="#000"
        inactiveColor="#000"
        codeInputStyle={styles.codeInputStyle}
        containerStyle={styles.containerStyle}
      />
      <Button
        title={t('common.verify')}
        onPress={() => {
          updatePhoneValidation({
            code: validationCode,
            id: route.params?.validationId
          });
        }}
        style={styles.confirmButton}
      />
      <Text>{t('screens.validatePhone.didntGetCode')}</Text>
      <Pressable
        onPress={() => {
          createPhoneValidation({
            phone_number: route.params?.phoneNumber
          });
        }}
      >
        <PrimaryText
          style={styles.resend}
          text={t('screens.validatePhone.resend')}
        />
      </Pressable>
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  },
  resend: {
    fontWeight: 'bold'
  },
  codeInputStyle: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 72,
    fontSize: 30
  },
  containerStyle: { flex: 0, marginBottom: 30 }
});

export default ValidatePhoneScreen;

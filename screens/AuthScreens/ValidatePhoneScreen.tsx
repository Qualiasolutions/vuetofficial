import React, { useEffect, useState } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Button } from 'components/Themed';

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
  PrimaryText
} from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';

const ValidatePhoneScreen = ({
  navigation,
  route
}: NativeStackScreenProps<UnauthorisedTabParamList, 'ValidatePhone'>) => {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [updatePhoneValidation, result] = useUpdatePhoneValidationMutation();
  const [createPhoneValidation, createPhoneResult] =
    useCreatePhoneValidationMutation();

  const ref = useBlurOnFulfill({ value: validationCode, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: validationCode,
    setValue: onChangeValidationCode
  });

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
      <CodeField
        ref={ref}
        {...props}
        value={validationCode}
        onChangeText={(code) => { onChangeValidationCode(code) }}
        cellCount={6}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
        autoFocus
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
  containerStyle: { flex: 0, marginBottom: 30 },
  cell: {
    width: 52,
    borderRadius: 10,
    height: 72,
    lineHeight: 68,
    fontSize: 30,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#fff',
    margin: 4,
    textAlign: 'center',
    overflow: 'hidden'
  },
  focusCell: {
    borderColor: '#D8D8D8'
  }
});

export default ValidatePhoneScreen;

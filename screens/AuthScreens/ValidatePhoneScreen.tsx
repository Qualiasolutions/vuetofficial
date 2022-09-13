import React, { useEffect, useState } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

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

  const greyColor = useThemeColor({}, 'grey');
  const whiteColor = useThemeColor({}, 'white');

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
        onChangeText={(code) => {
          onChangeValidationCode(code);
        }}
        cellCount={6}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[
              styles.cell,
              { borderColor: greyColor, backgroundColor: whiteColor },
              isFocused && { borderColor: greyColor }
            ]}
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
        <PrimaryText text={t('screens.validatePhone.resend')} bold={true} />
      </Pressable>
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
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
    margin: 4,
    textAlign: 'center',
    overflow: 'hidden'
  }
});

export default ValidatePhoneScreen;

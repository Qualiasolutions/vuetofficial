import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { Text, useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  useCreateEmailValidationMutation,
  useCreatePhoneValidationMutation,
  useUpdateEmailValidationMutation,
  useUpdatePhoneValidationMutation
} from 'reduxStore/services/api/signup';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';
import { PrimaryText } from './TextComponents';
import {
  TransparentContainerView,
  TransparentPaddedView
} from './ViewComponents';
import SafePressable from './SafePressable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  },
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

type ValidationCodeInputProps = {
  validationId: number;
  phoneNumber: string;
  isEmail?: boolean;
  onSuccess: () => void;
  onError: (err: any) => void;
};
export default function ValidationCodeInput({
  validationId,
  phoneNumber,
  isEmail,
  onSuccess,
  onError
}: ValidationCodeInputProps) {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const ref = useBlurOnFulfill({ value: validationCode, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: validationCode,
    setValue: onChangeValidationCode
  });
  const [updatePhoneValidation, phoneValidationResult] =
    useUpdatePhoneValidationMutation();
  const [updateEmailValidation, emailValidationResult] =
    useUpdateEmailValidationMutation();
  const [createPhoneValidation, createPhoneValidationResult] =
    useCreatePhoneValidationMutation();
  const [createEmailValidation, createEmailValidationResult] =
    useCreateEmailValidationMutation();

  const greyColor = useThemeColor({}, 'grey');
  const whiteColor = useThemeColor({}, 'white');

  const { t } = useTranslation();

  useEffect(() => {
    if (phoneValidationResult.isSuccess) {
      onSuccess();
    } else {
      if (phoneValidationResult.error) {
        onError(phoneValidationResult.error);
      }
    }
  }, [phoneValidationResult, onError, onSuccess]);

  useEffect(() => {
    if (emailValidationResult.isSuccess) {
      onSuccess();
    } else {
      if (emailValidationResult.error) {
        onError(emailValidationResult.error);
      }
    }
  }, [emailValidationResult, onError, onSuccess]);

  return (
    <TransparentPaddedView style={styles.container}>
      <Text>
        {isEmail
          ? t('screens.validatePhone.enterEmailCode')
          : t('screens.validatePhone.enterCode')}
      </Text>
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
          if (isEmail) {
            updateEmailValidation({
              code: validationCode,
              id: validationId
            });
          } else {
            updatePhoneValidation({
              code: validationCode,
              id: validationId
            });
          }
        }}
        style={styles.confirmButton}
      />
      <Text>{t('screens.validatePhone.didntGetCode')}</Text>
      <SafePressable
        onPress={() => {
          if (isEmail) {
            createEmailValidation({
              email: phoneNumber
            });
          } else {
            createPhoneValidation({
              phone_number: phoneNumber
            });
          }
        }}
      >
        <PrimaryText text={t('screens.validatePhone.resend')} bold={true} />
      </SafePressable>
    </TransparentPaddedView>
  );
}

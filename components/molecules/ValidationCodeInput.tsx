import React from 'react';
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
import { TransparentPaddedView } from './ViewComponents';
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
  const [updatePhoneValidation] = useUpdatePhoneValidationMutation();
  const [updateEmailValidation] = useUpdateEmailValidationMutation();
  const [createPhoneValidation] = useCreatePhoneValidationMutation();
  const [createEmailValidation] = useCreateEmailValidationMutation();

  const greyColor = useThemeColor({}, 'grey');
  const whiteColor = useThemeColor({}, 'white');

  const { t } = useTranslation();

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
        onPress={async () => {
          if (isEmail) {
            try {
              await updateEmailValidation({
                code: validationCode,
                id: validationId
              }).unwrap();
              onSuccess();
            } catch (err) {
              onError(err);
            }
          } else {
            try {
              await updatePhoneValidation({
                code: validationCode,
                id: validationId
              }).unwrap();
              onSuccess();
            } catch (err) {
              onError(err);
            }
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

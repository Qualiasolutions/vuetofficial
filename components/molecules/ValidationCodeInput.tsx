import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { Text, useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  useUpdatePhoneValidationMutation
} from 'reduxStore/services/api/signup';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';

type ValidationCodeInputProps = {
  validationId: number;
  onSuccess: () => void;
  onError: (err: any) => void;
}
export default function ValidationCodeInput({ validationId, onSuccess, onError }: ValidationCodeInputProps) {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const ref = useBlurOnFulfill({ value: validationCode, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: validationCode,
    setValue: onChangeValidationCode
  });
  const [updatePhoneValidation, result] = useUpdatePhoneValidationMutation();

  const greyColor = useThemeColor({}, 'grey');
  const whiteColor = useThemeColor({}, 'white');

  const { t } = useTranslation()

  useEffect(() => {
    if (result.isSuccess) {
      onSuccess()
    } else {
      if (result.error) {
        onError(result.error)
      }
    }
  }, [result]);

  return <>
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
          id: validationId
        });
      }}
      style={styles.confirmButton}
    />
  </>
}

const styles = StyleSheet.create({
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
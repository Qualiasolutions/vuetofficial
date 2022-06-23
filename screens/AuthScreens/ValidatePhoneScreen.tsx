import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, View, TextInput, Button } from 'components/Themed';

import GLOBAL_STYLES from 'globalStyles/styles';

import { UnauthorisedTabScreenProps } from 'types/base';
import { useCreatePhoneValidationMutation, useUpdatePhoneValidationMutation } from 'reduxStore/services/api/signup';

const ValidatePhoneScreen = ({ navigation }: UnauthorisedTabScreenProps<'Login'> ) => {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [updatePhoneValidation, result] = useUpdatePhoneValidationMutation({
    fixedCacheKey: 'shared-update-phone-validation',
  })

  const [createPhoneValidation, createResult] = useCreatePhoneValidationMutation({
    fixedCacheKey: 'shared-create-phone-validation',
  })

  const { t } = useTranslation();

  useEffect(() => {
    if (result.isSuccess) {
      navigation.navigate("CreatePassword")
    } else {
      if (result.error) {
        setErrorMessage(t('screens.validatePhone.codeError'))
      }
    }
  }, [result])

  const errorContent = errorMessage ? (
    <View>
      <Text style={GLOBAL_STYLES.errorMessage}>{errorMessage}</Text>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <Text
        darkColor="#AC3201"
        lightColor="#AC3201"
        style={styles.header}
      >{t('screens.validatePhone.title')}</Text>
      <Text style={styles.subheader}>{t('screens.validatePhone.enterCode')}</Text>
      {errorContent}
      <TextInput
        value={validationCode}
        onChangeText={(text) => onChangeValidationCode(text)}
      />
      <Button
        title={t('common.verify')}
        onPress={() => {
          if (createResult.data) {
            updatePhoneValidation({
              code: validationCode,
              id: createResult.data?.id
            })
          }
        }}
        style={styles.confirmButton}
      />
      <Text>{t('screens.validatePhone.didntGetCode')}</Text>
      <Pressable onPress={() => {
        if (createResult.data) {
          createPhoneValidation({
            phone_number: createResult.data.phone_number
          })
        }
      }}>
      <Text
        lightColor="#AC3201"
        darkColor="#AC3201"
        style={styles.signUp}
      >{t('screens.validatePhone.resend')}</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#EFEFEF'
  },
  header: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  subheader: {
    fontSize: 14,
    color: "#707070",
    marginBottom: 20,
  },
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#EFEFEF'
  },
  inputLabel: {
    fontSize: 12,
    color: "#707070",
    textAlign: 'left'
  },
  confirmButton: {
    marginTop: 30,
    marginBottom: 15,
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: '#EFEFEF'
  },
  forgotPassword: {
    fontWeight: "bold"
  },
  signUp: {
    fontWeight: 'bold'
  }
});

export default ValidatePhoneScreen;

import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, View, TextInput, Button } from 'components/Themed';

import GLOBAL_STYLES from 'globalStyles/styles';

import { UnauthorisedTabParamList } from 'types/base';
import { useCreatePhoneValidationMutation, useUpdatePhoneValidationMutation } from 'reduxStore/services/api/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isFieldErrorCodeError } from 'types/signup';

const ValidatePhoneScreen = ({ navigation, route }: NativeStackScreenProps<UnauthorisedTabParamList, 'ValidatePhone'> ) => {
  const [validationCode, onChangeValidationCode] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [updatePhoneValidation, result] = useUpdatePhoneValidationMutation()
  const [createPhoneValidation, createPhoneResult] = useCreatePhoneValidationMutation()

  const { t } = useTranslation();

  useEffect(() => {
    if (result.isSuccess) {
      navigation.navigate("CreatePassword", {
        phoneNumber: route.params.phoneNumber
      })
    } else {
      if (result.error) {
        if (isFieldErrorCodeError("code", "invalid_code")) {
          setErrorMessage(t('screens.validatePhone.invalidCodeError'))
        } else {
          setErrorMessage(t('common.genericError'))
        }
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
          updatePhoneValidation({
            code: validationCode,
            id: route.params?.validationId
          })
        }}
        style={styles.confirmButton}
      />
      <Text>{t('screens.validatePhone.didntGetCode')}</Text>
      <Pressable onPress={() => {
        createPhoneValidation({
          phone_number: route.params?.phoneNumber
        })
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

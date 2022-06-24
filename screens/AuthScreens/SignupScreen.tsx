import React, { useEffect } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, View, TextInput, Button } from 'components/Themed';

import GLOBAL_STYLES from 'globalStyles/styles';

import { UnauthorisedTabParamList } from 'types/base';
import { useCreatePhoneValidationMutation } from 'reduxStore/services/api/signup';
import { isFieldErrorCodeError, isInvalidPhoneNumberError } from 'types/signup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const SignupScreen = ({ navigation }: NativeStackScreenProps<UnauthorisedTabParamList, 'Signup'> ) => {
  const [phoneNumber, onChangePhoneNumber] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  
  const [createPhoneValidation, result] = useCreatePhoneValidationMutation()

  const { t } = useTranslation();

  useEffect(() => {
    if (result.isSuccess) {
      navigation.navigate("ValidatePhone", {
        validationId: result.data.id,
        phoneNumber: result.data.phone_number
      })
    } else {
      if (result.error) {
        if (isFieldErrorCodeError('phone_number', 'phone_number_used')(result.error)) {
          setErrorMessage(t('screens.signUp.phoneUsedError'))
        } else if (isInvalidPhoneNumberError(result.error)) {
          setErrorMessage(t('screens.signUp.phoneInvalidError'))
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
      >{t('screens.signUp.welcome')}</Text>
      <Text style={styles.subheader}>{t('screens.signUp.usePhoneNumber')}</Text>
      {errorContent}
      <View style={styles.inputLabelWrapper}>
        <Text style={styles.inputLabel}>{t('screens.logIn.phoneNumber')}</Text>
      </View>
      <TextInput
        value={phoneNumber}
        onChangeText={(text) => onChangePhoneNumber(text)}
      />
      <Button
        title={t('common.confirm')}
        onPress={() => {
          createPhoneValidation({phone_number: phoneNumber})
        }}
        style={styles.confirmButton}
      />
      <Text>{t('screens.signUp.alreadyHaveAccount')}</Text>
      <Pressable onPress={() => {
        navigation.navigate('Login')}}>
      <Text
        lightColor="#AC3201"
        darkColor="#AC3201"
        style={styles.signUp}
      >{t('screens.signUp.logIn')}</Text>
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

export default SignupScreen;

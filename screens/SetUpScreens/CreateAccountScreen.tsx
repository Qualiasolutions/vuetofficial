import React, { useEffect } from 'react';

import { StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { TextInput, Button } from 'components/Themed';

import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  PageTitle,
  PageSubtitle,
  AlmostBlackText
} from 'components/molecules/TextComponents';
import {
  AlmostWhiteContainerView,
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useUpdateUserDetailsMutation
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { WhiteDateInput } from 'components/forms/components/DateInputs';
import { ColorPicker } from 'components/forms/components/ColorPickers';
import { WhiteImagePicker } from 'components/forms/components/ImagePicker';
import dayjs from 'dayjs';

const CreateAccountScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'CreateAccount'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
  );

  const [firstName, onChangeFirstName] = React.useState<string>('');
  const [lastName, onChangeLastName] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);
  const [memberColour, setMemberColour] = React.useState<string>('');

  const [updateUserDetails, result] = useUpdateUserDetailsMutation();

  useEffect(() => {
    if (result.isSuccess) {
      navigation.push('AddFamily');
    } else {
      if (result.error) {
        setErrorMessage(t('common.genericError'));
      }
    }
  }, [result]);

  useEffect(() => {
    if (
      userFullDetails?.member_colour &&
      userFullDetails?.first_name &&
      userFullDetails?.last_name &&
      userFullDetails?.dob
    ) {
      navigation.push('AddFamily');
    }
  }, [userDetails, userFullDetails]);

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  if (!userFullDetails) {
    return null
  }

  if (
    userFullDetails?.member_colour &&
    userFullDetails?.first_name &&
    userFullDetails?.last_name &&
    userFullDetails?.dob
  ) {
    return null
  }

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.createAccount.title')} />
      <PageSubtitle text={t('screens.createAccount.addDetails')} />
      <WhiteImagePicker onImageSelect={(imageLocation) => {}} />
      {errorContent}
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.createAccount.firstName')}
        />
      </TransparentView>
      <TextInput
        value={firstName}
        onChangeText={(text) => onChangeFirstName(text)}
      />
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.createAccount.lastName')}
        />
      </TransparentView>
      <TextInput
        value={lastName}
        onChangeText={(text) => onChangeLastName(text)}
      />
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.createAccount.dob')}
        />
      </TransparentView>
      <WhiteDateInput
        value={dateOfBirth}
        maximumDate={new Date()}
        onSubmit={(newValue: Date) => {
          setDateOfBirth(newValue);
        }}
        handleErrors={() => {
          setErrorMessage(t('screens.createAccount.invalidDateMessage'));
        }}
      />
      <WhiteBox style={styles.memberColorBox}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.createAccount.memberColour')}
        />
        <ColorPicker
          value={memberColour}
          onValueChange={(value: string) => {
            setMemberColour(value);
          }}
        />
      </WhiteBox>
      <Button
        title={t('common.next')}
        onPress={() => {
          if (firstName && lastName && dateOfBirth && memberColour) {
            updateUserDetails({
              user_id: userDetails?.user_id || -1,
              first_name: firstName,
              last_name: lastName,
              dob: dayjs(dateOfBirth).format('YYYY-MM-DD'),
              member_colour: memberColour
            });
          } else {
            setErrorMessage(t('screens.createAccount.allFieldsRequiredError'));
          }
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  inputLabel: {
    fontSize: 12,
    textAlign: 'left'
  },
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  },
  memberColorBox: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default CreateAccountScreen;

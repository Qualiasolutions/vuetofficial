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
  useCreateUserInviteMutation,
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { WhiteDateInput } from 'components/forms/components/DateInputs';
import { ColorPicker } from 'components/forms/components/ColorPickers';
import dayjs from 'dayjs';

const AddFamilyMemberScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'AddFamilyMember'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true
    }
  );

  const [firstName, onChangeFirstName] = React.useState<string>('');
  const [lastName, onChangeLastName] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [phoneNumber, onChangePhoneNumber] = React.useState<string>('');
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null);
  const [memberColour, setMemberColour] = React.useState<string>('');

  const [createUserInvite, result] = useCreateUserInviteMutation();
  
  useEffect(() => {
    if (result.isSuccess) {
      navigation.navigate('AddFamily');
    } else {
      if (result.error) {
        setErrorMessage(t('common.genericError'));
      }
    }
  }, [result]);

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.addFamilyMember.title')} />
      {errorContent}
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.addFamilyMember.firstName')}
        />
      </TransparentView>
      <TextInput
        value={firstName}
        onChangeText={(text) => onChangeFirstName(text)}
      />
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.addFamilyMember.lastName')}
        />
      </TransparentView>
      <TextInput
        value={lastName}
        onChangeText={(text) => onChangeLastName(text)}
      />
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.addFamilyMember.dob')}
        />
      </TransparentView>
      <WhiteDateInput
        value={dateOfBirth}
        maximumDate={new Date()}
        onSubmit={(newValue: Date) => {
          setDateOfBirth(newValue);
        }}
        handleErrors={() => {
          setErrorMessage(t('screens.addFamilyMember.invalidDateMessage'));
        }}
      />
      <WhiteBox style={styles.memberColorBox}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.addFamilyMember.memberColour')}
        />
        <ColorPicker
          value={memberColour}
          onValueChange={(value: string) => {
            setMemberColour(value);
          }}
        />
      </WhiteBox>
      <TransparentView style={styles.inputLabelWrapper}>
        <AlmostBlackText
          style={styles.inputLabel}
          text={t('screens.addFamilyMember.phoneNumber')}
        />
      </TransparentView>
      <TextInput
        value={phoneNumber}
        onChangeText={(text) => onChangePhoneNumber(text)}
      />
      <Button
        title={t('screens.addFamilyMember.add')}
        onPress={() => {
          console.log(userFullDetails)
          if (
            firstName
            && lastName
            && dateOfBirth
            && memberColour
            && phoneNumber
            && userFullDetails?.family?.id
          ) {
            createUserInvite({
              family: userFullDetails?.family?.id,
              invitee: userFullDetails?.id,
              first_name: firstName,
              last_name: lastName,
              dob: dayjs(dateOfBirth).format('YYYY-MM-DD'),
              member_colour: memberColour,
              phone_number: phoneNumber
            });
          } else {
            setErrorMessage(t('screens.addFamilyMember.allFieldsRequiredError'));
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
    marginBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default AddFamilyMemberScreen;

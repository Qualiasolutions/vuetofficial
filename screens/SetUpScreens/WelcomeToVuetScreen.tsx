import React, { useEffect } from 'react';

import { Image, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/molecules/ButtonComponents';

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

const WelcomeToVuetScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'AddFamily'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true,
      skip: !userDetails?.user_id
    }
  );

  const [updateUserDetails, result] = useUpdateUserDetailsMutation();

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { t } = useTranslation();

  useEffect(() => {
    if (result.error) {
      setErrorMessage(t('common.errors.generic'));
    }
  }, [result]);

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <Image
        source={require('../../assets/images/icons/tick-circle.png')}
        style={styles.tickIcon}
      />
      <PageTitle
        text={t('screens.welcomeToVuet.title', {
          name: userFullDetails?.first_name
        })}
      />
      <PageSubtitle text={t('screens.welcomeToVuet.createdSuccessfully')} />
      <PageSubtitle text={t('screens.welcomeToVuet.willSend')} />
      {errorContent}
      <Button
        title={t('common.continue')}
        onPress={() => {
          if (userDetails?.user_id) {
            updateUserDetails({
              user_id: userDetails?.user_id,
              has_done_setup: true
            });
          }
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  },
  tickIcon: {
    height: 50,
    width: 50,
    marginBottom: 40
  }
});

export default WelcomeToVuetScreen;

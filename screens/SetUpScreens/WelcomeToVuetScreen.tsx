import React, { useEffect } from 'react';

import { Image, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Button } from 'components/molecules/ButtonComponents';

import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PageTitle, PageSubtitle } from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import { useUpdateUserDetailsMutation } from 'reduxStore/services/api/user';
import useGetUserFullDetails from 'hooks/useGetUserDetails';

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

const WelcomeToVuetScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'AddFamily'>) => {
  const { data: userFullDetails } = useGetUserFullDetails();

  const [updateUserDetails, result] = useUpdateUserDetailsMutation();

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { t } = useTranslation();

  useEffect(() => {
    if (result.error) {
      setErrorMessage(t('common.errors.generic'));
    }
  }, [result]);

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage} />
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
          if (userFullDetails?.id) {
            updateUserDetails({
              user_id: userFullDetails?.id,
              has_done_setup: true
            });
          }
        }}
        style={styles.confirmButton}
      />
    </AlmostWhiteContainerView>
  );
};

export default WelcomeToVuetScreen;

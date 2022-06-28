import React from 'react';

import { Pressable, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from 'components/Themed';

import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  PageTitle,
  PageSubtitle,
  AlmostBlackText
} from 'components/molecules/TextComponents';
import { AlmostWhiteContainerView } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { WhiteImagePicker } from 'components/forms/components/ImagePicker';

const AddFamilyScreen = ({
  navigation
}: NativeStackScreenProps<SetupTabParamList, 'AddFamily'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true
    }
  );

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.addFamily.title')} />
      <PageSubtitle text={t('screens.addFamily.startAdding')} />
      <WhiteImagePicker onImageSelect={(imageLocation) => {}} />
      <Button
        title={t('common.next')}
        onPress={() => {}}
        style={styles.confirmButton}
      />
      <Pressable
        onPress={() => {
          navigation.navigate('WelcomeToVuet');
        }}
      >
        <AlmostBlackText text="Later" />
      </Pressable>
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  }
});

export default AddFamilyScreen;

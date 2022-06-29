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
import { AlmostWhiteContainerView, TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
import { ErrorBox } from 'components/molecules/Errors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
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

  const { data: userInvites } =  useGetUserInvitesQuery(userFullDetails?.family?.id || -1)

  const { t } = useTranslation();

  const errorContent = errorMessage ? (
    <ErrorBox errorText={errorMessage}></ErrorBox>
  ) : null;

  const addedMembersContent = (userInvites && (userInvites.length > 0))
    ? userInvites.map(invite => (<TransparentView key={invite.id}>
      <AlmostBlackText text={`${invite.first_name} ${invite.last_name}`}/>
    </TransparentView>)
    )
    : <AlmostBlackText text={t('screens.addFamily.currentlyNone')}/>

  return (
    <AlmostWhiteContainerView>
      <PageTitle text={t('screens.addFamily.title')} />
      <PageSubtitle text={t('screens.addFamily.startAdding')} />
      <WhiteImagePicker style={styles.imagePicker} onImageSelect={(imageLocation) => {}} />
      {addedMembersContent}
      <Button
        title={t('screens.addFamily.addMember')}
        onPress={() => {
          navigation.navigate('AddFamilyMember');
        }}
        style={styles.confirmButton}
      />
      <Pressable
        onPress={() => {
          navigation.navigate('WelcomeToVuet');
        }}
      >
        <Button
          title={t('common.next')}
          onPress={() => {
            navigation.navigate('WelcomeToVuet');
          }}
          style={styles.confirmButton}
        />
      </Pressable>
    </AlmostWhiteContainerView>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    marginTop: 30,
    marginBottom: 15
  },
  imagePicker: {
    marginBottom: 30
  },
  addedMembers: {
    width: '100%',
    marginTop: 30
  }
});

export default AddFamilyScreen;

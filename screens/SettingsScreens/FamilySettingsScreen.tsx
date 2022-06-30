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
import { useUpdateFamilyDetailsMutation } from 'reduxStore/services/api/family';

const FamilySettingsScreen = ({
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

  const [updateFamilyDetails, result] = useUpdateFamilyDetailsMutation()

  const uploadProfileImage = (image: File) => {
    if (userFullDetails) {
      const data = new FormData();
      data.append('image', image);
      updateFamilyDetails({
        familyId: userFullDetails.family.id,
        formData: data
      })
    }
  }

  return (
    <AlmostWhiteContainerView>
      <WhiteImagePicker
        style={styles.imagePicker}
        onImageSelect={(image) => { uploadProfileImage(image) }}
        defaultImageUrl={userFullDetails?.family?.image}
      />
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

export default FamilySettingsScreen;

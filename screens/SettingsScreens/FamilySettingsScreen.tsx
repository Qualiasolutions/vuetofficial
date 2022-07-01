import React from 'react';

import { StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


import { SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AlmostWhiteContainerView,
} from 'components/molecules/ViewComponents';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { PickedFile, WhiteImagePicker } from 'components/forms/components/ImagePicker';
import { useUpdateFamilyDetailsMutation } from 'reduxStore/services/api/family';

const FamilySettingsScreen = ({
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

  const [updateFamilyDetails, result] = useUpdateFamilyDetailsMutation();

  const uploadProfileImage = (image: PickedFile) => {
    if (userFullDetails) {
      const data = new FormData();
      // typescript complaining about `image` not being a Blob but it works :shrug: 
      data.append('image', image as any);
      updateFamilyDetails({
        familyId: userFullDetails.family.id,
        formData: data
      });
    }
  };

  return (
    <AlmostWhiteContainerView>
      <WhiteImagePicker
        style={styles.imagePicker}
        onImageSelect={(image) => {
          uploadProfileImage(image);
        }}
        defaultImageUrl={userFullDetails?.family?.presigned_image_url}
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

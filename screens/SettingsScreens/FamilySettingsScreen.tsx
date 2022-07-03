import React from 'react';

import { Image, Pressable, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SettingsTabParamList, SetupTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AlmostWhiteContainerView,
  AlmostWhiteView,
  TransparentView,
  WhiteBox,
  WhiteContainerView,
  WhiteView
} from 'components/molecules/ViewComponents';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  FullWidthImagePicker,
  PickedFile,
  WhiteImagePicker
} from 'components/forms/components/ImagePicker';
import { useUpdateFamilyDetailsMutation } from 'reduxStore/services/api/family';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { View } from 'components/Themed';
import { UserFullResponse, UserInviteResponse } from 'types/users';

const FamilySettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'FamilySettings'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true,
      skip: !userDetails?.user_id
    }
  );

  const { data: userInvites } = useGetUserInvitesQuery(
    userDetails?.user_id || -1
  );

  const [updateFamilyDetails, result] = useUpdateFamilyDetailsMutation();

  const { t } = useTranslation();

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

  const familyPhoneNumbers =
    userFullDetails?.family.users.map((user) => user.phone_number) || [];

  const familyInvites = userInvites?.filter(
    (invite) =>
      invite.family === userFullDetails?.family.id &&
      !familyPhoneNumbers.includes(invite.phone_number)
  );

  const userToListElement = (
    user: UserFullResponse | UserInviteResponse,
    nameSuffix = ''
  ) => (
    <TransparentView style={styles.listElement} key={user.id}>
      <TransparentView>
        <AlmostBlackText
          style={styles.listElementText}
          text={`${user.first_name} ${user.last_name}${nameSuffix}`}
        />
        <View
          style={[
            styles.colourBar,
            { backgroundColor: `#${user.member_colour}` }
          ]}
        />
      </TransparentView>
      <TransparentView style={styles.listRight}>
        <Pressable onPress={() => {
          navigation.navigate('EditFamilyMember', { id: user.id });
        }}>
          <Image
            style={styles.editIcon}
            source={require('../../assets/images/icons/feather-edit.png')}
          />
        </Pressable>
        <Pressable onPress={() => {}}>
          <Image
            style={styles.editIcon}
            source={require('../../assets/images/icons/remove-circle.png')}
          />
        </Pressable>
      </TransparentView>
    </TransparentView>
  );

  const familyMemberList = userFullDetails?.family.users.map((user) =>
    userToListElement(user)
  );
  const familyInvitesList = familyInvites?.map((user) =>
    userToListElement(user, ' (pending)')
  );

  return (
    <TransparentView style={styles.container}>
      <AlmostWhiteView>
        <FullWidthImagePicker
          onImageSelect={(image) => {
            uploadProfileImage(image);
          }}
          defaultImageUrl={userFullDetails?.family?.presigned_image_url}
        />
      </AlmostWhiteView>
      <AlmostWhiteView style={styles.familyHeader}>
        <AlmostBlackText
          style={styles.familyHeaderText}
          text={t('screens.familySettings.family')}
        />
      </AlmostWhiteView>
      <WhiteView style={styles.listContainer}>
        <TransparentView style={[styles.listElement, styles.listHeader]}>
          <AlmostBlackText
            style={styles.headerText}
            text={t('screens.familySettings.familyMembers')}
          />
          <Pressable
            onPress={() => {
              navigation.navigate('AddFamilyMember');
            }}
          >
            <Image
              style={styles.plusIcon}
              source={require('../../assets/images/icons/plus-square.png')}
            />
          </Pressable>
        </TransparentView>
        {familyMemberList}
        {familyInvitesList}
      </WhiteView>
    </TransparentView>
  );
};

const styles = StyleSheet.create({
  familyHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20
  },
  familyHeaderText: { fontSize: 22 },
  container: {
    justifyContent: 'flex-start'
  },
  colourBar: {
    width: 70,
    height: 6
  },
  listContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 40,
    justifyContent: 'flex-start'
  },
  listHeader: {
    borderBottomWidth: 1,
    marginBottom: 10
  },
  headerText: {},
  listElement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10
  },
  listElementText: {
    fontSize: 18
  },
  listRight: {
    flexDirection: 'row'
  },
  editIcon: {
    width: 20,
    height: 20,
    margin: 5
  },
  plusIcon: {
    width: 50,
    height: 50,
    margin: 5
  }
});

export default FamilySettingsScreen;

import React, { useState } from 'react';

import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SettingsTabParamList } from 'types/base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AlmostWhiteView,
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import {
  useDeleteUserInviteMutation,
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery,
  useGetUserInvitesQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  FullWidthImagePicker,
  PickedFile
} from 'components/forms/components/ImagePicker';
import { useUpdateFamilyDetailsMutation } from 'reduxStore/services/api/family';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { View } from 'components/Themed';
import { UserInviteResponse, UserResponse } from 'types/users';
import { YesNoModal } from 'components/molecules/Modals';

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

  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);
  const [userInviteToDelete, setUserInviteToDelete] =
    useState<UserInviteResponse | null>(null);

  const { data: userInvites } = useGetUserInvitesQuery(
    userDetails?.user_id || -1
  );

  const [updateFamilyDetails, result] = useUpdateFamilyDetailsMutation();
  const [deleteUserInvite, deleteUserInviteResult] =
    useDeleteUserInviteMutation();

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
    user: UserResponse | UserInviteResponse,
    isPending: boolean = false
  ) => (
    <TransparentView style={styles.listElement} key={user.id}>
      <TransparentView style={styles.listLeft}>
        <AlmostBlackText
          style={styles.listElementText}
          text={`${user.first_name} ${user.last_name}${
            isPending ? ' (pending)' : ''
          }`}
        />
        <View
          style={[
            styles.colourBar,
            { backgroundColor: `#${user.member_colour}` }
          ]}
        />
      </TransparentView>
      <TransparentView style={styles.listRight}>
        <Pressable
          onPress={() => {
            navigation.navigate(
              isPending ? 'EditFamilyInvite' : 'EditFamilyMember',
              { id: user.id }
            );
          }}
        >
          <Image
            style={styles.editIcon}
            source={require('../../assets/images/icons/feather-edit.png')}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            const isUserInvite = (user: any): user is UserInviteResponse =>
              isPending;
            if (isUserInvite(user)) {
              setUserInviteToDelete(user);
            } else {
              setUserToDelete(user);
            }
          }}
        >
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
    userToListElement(user, true)
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <YesNoModal
        title="Before you proceed"
        question={`Are you sure you want to remove ${userToDelete?.first_name} ${userToDelete?.last_name} from the family?`}
        visible={!!userToDelete}
        onYes={() => {}}
        onNo={() => {
          setUserToDelete(null);
        }}
      />
      <YesNoModal
        title="Before you proceed"
        question={`Are you sure you want to remove ${userInviteToDelete?.first_name} ${userInviteToDelete?.last_name} from the family?`}
        visible={!!userInviteToDelete}
        onYes={() => {
          if (userInviteToDelete) {
            deleteUserInvite({ id: userInviteToDelete.id });
            setUserInviteToDelete(null);
          }
        }}
        onNo={() => {
          setUserInviteToDelete(null);
        }}
      />
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
    </ScrollView>
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
  scrollContainer: {
    height: '100%'
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
  listLeft: {
    maxWidth: '80%'
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

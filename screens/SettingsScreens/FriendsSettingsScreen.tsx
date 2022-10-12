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
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { UserInviteResponse, UserResponse } from 'types/users';
import { YesNoModal } from 'components/molecules/Modals';
import UserWithColor from 'components/molecules/UserWithColor';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  useDeleteFriendshipMutation,
  useGetAllFriendshipsQuery
} from 'reduxStore/services/api/friendships';

const FriendSettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'FriendSettings'>) => {
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
    userDetails?.user_id || -1,
    {
      skip: !userDetails?.user_id
    }
  );

  const [deleteUserInvite, deleteUserInviteResult] =
    useDeleteUserInviteMutation();

  const [deleteFriendship, deleteFriendshipResult] =
    useDeleteFriendshipMutation();

  const { data: allFriendships, isLoading: isLoadingFriendships } =
    useGetAllFriendshipsQuery(userDetails?.user_id || -1, {
      skip: !userDetails?.user_id
    });

  const { t } = useTranslation();

  if (!userFullDetails || isLoadingFriendships) {
    return <FullPageSpinner />;
  }

  const friendPhoneNumbers =
    userFullDetails?.friends.map((user) => user.phone_number) || [];

  const friendInvites = userInvites?.filter(
    (invite) =>
      invite.family === null &&
      !friendPhoneNumbers.includes(invite.phone_number) &&
      !(invite.phone_number === userFullDetails.phone_number)
  );

  const isUserResponse = (x: any): x is UserResponse =>
    !!x.presigned_profile_image_url;

  const userToListElement = (
    user: UserResponse | UserInviteResponse,
    isPending: boolean = false
  ) => {
    const nameToShow =
      user.first_name || user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.phone_number;
    return (
      <TransparentView style={styles.listElement} key={user.id}>
        <UserWithColor
          name={`${nameToShow}${isPending ? ' (pending)' : ''}`}
          memberColour={user.member_colour || 'efefef'}
          userImage={
            isUserResponse(user) ? user.presigned_profile_image_url : ''
          }
        />
        <TransparentView style={styles.listRight}>
          {isPending && (
            <Pressable
              onPress={() => {
                navigation.navigate(
                  'EditFamilyInvite', // TODO - rename this to `EditUserInvite`
                  { id: user.id }
                );
              }}
            >
              <Image
                style={styles.editIcon}
                source={require('../../assets/images/icons/feather-edit.png')}
              />
            </Pressable>
          )}
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
  };

  const friendsList = userFullDetails?.friends.map((user) =>
    userToListElement(user)
  );
  const friendInvitesList = friendInvites?.map((user) =>
    userToListElement(user, true)
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <YesNoModal
        title="Before you proceed"
        question={`Are you sure you want to remove ${userToDelete?.first_name} ${userToDelete?.last_name} from your Vuet circle?`}
        visible={!!userToDelete}
        onYes={() => {
          const friendshipToDelete = allFriendships?.find(
            (friendship) =>
              friendship.creator === userToDelete?.id ||
              friendship.friend === userToDelete?.id
          );
          if (friendshipToDelete) {
            deleteFriendship({ id: friendshipToDelete.id });
            setUserInviteToDelete(null);
          }
        }}
        onNo={() => {
          setUserToDelete(null);
        }}
      />
      <YesNoModal
        title="Before you proceed"
        question={`Are you sure you want to remove ${userInviteToDelete?.first_name} ${userInviteToDelete?.last_name} from your Vuet circle?`}
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
      <AlmostWhiteView style={styles.friendsHeader}>
        <AlmostBlackText
          style={styles.friendsHeaderText}
          text={t('screens.friendSettings.friends')}
        />
        <Pressable onPress={() => {
          navigation.navigate('CreateUserInvite', {
            familyRequest: false
          });
        }}>
          <Image
            source={require('assets/images/icons/plus.png')}
            style={styles.plusIcon}
          />
        </Pressable>
      </AlmostWhiteView>
      <WhiteView style={styles.listContainer}>
        {friendsList}
        {friendInvitesList}
      </WhiteView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  friendsHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  friendsHeaderText: { fontSize: 22 },
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
    width: 30,
    height: 30,
    marginLeft: 10
  }
});

export default FriendSettingsScreen;

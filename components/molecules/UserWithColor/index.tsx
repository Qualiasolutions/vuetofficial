import React from 'react';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import {
  AlmostWhiteView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Image, StyleSheet, View } from 'react-native';

export default function UserWithColor({
  name = '',
  memberColour = '',
  userImage = '',
  showUserImage = true
}) {
  return (
    <TransparentView style={styles.container}>
      {showUserImage ? (
        <AlmostWhiteView style={styles.profileImageWrapper}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          ) : (
            <Image
              source={require('assets/images/icons/user-head.png')}
              style={[styles.profileImage, styles.placeholderImage]}
            />
          )}
        </AlmostWhiteView>
      ) : null}
      <TransparentView>
        <AlmostBlackText text={name} style={styles.nameText} />
        <View
          style={[styles.memberColour, { backgroundColor: `#${memberColour}` }]}
        />
      </TransparentView>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  memberColour: {
    height: 9,
    width: 78,
    marginTop: 5
  },
  profileImageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileImage: {
    width: '100%',
    height: '100%'
  },
  placeholderImage: {
    width: '60%',
    height: '60%'
  },
  nameText: { fontSize: 16 }
});

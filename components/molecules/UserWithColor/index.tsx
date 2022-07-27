import React from 'react';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import { StyleSheet, View } from 'react-native';

export default function UserWithColor({ name = '', memberColour = '' }) {
  return (
    <TransparentView>
      <AlmostBlackText text={name} />
      <View
        style={[styles.memberColour, { backgroundColor: `#${memberColour}` }]}
      />
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  memberColour: {
    height: 9,
    width: 78,
    marginTop: 5
  }
});

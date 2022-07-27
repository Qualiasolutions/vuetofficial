import { useThemeColor, View } from 'components/Themed';
import Colors from '../../../constants/Colors';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
const CHECKBOX_HEIGHT = 23;
const CHECKBOX_WIDTH = 23;
const CHECKBOX_RADIUS = 2;

export default function Checkbox({ checked = false }) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const backgroundColor = checked ? primaryColor : greyColor;
  const activeStyle = checked ? styles.active : styles.inactive;

  return (
    <View style={[activeStyle, { backgroundColor }]}>
      {checked && (
        <Image
          source={require('assets/images/icons/check.png')}
          style={styles.check}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inactive: {
    height: CHECKBOX_HEIGHT,
    width: CHECKBOX_WIDTH,
    borderRadius: CHECKBOX_RADIUS
  },
  active: {
    height: CHECKBOX_HEIGHT,
    width: CHECKBOX_WIDTH,
    borderRadius: CHECKBOX_RADIUS,
    justifyContent: 'center',
    alignItems: 'center'
  },
  check: {
    height: 17,
    width: 13
  }
});

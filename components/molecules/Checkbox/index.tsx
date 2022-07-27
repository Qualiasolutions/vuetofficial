import { useThemeColor, View } from 'components/Themed';
import Colors from '../../../constants/Colors';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
const CHECKBOX_HEIGHT = 23;
const CHECKBOX_WIDTH = 23;
const CHECKBOX_RADIUS = 2;

export default function Checkbox({ checked = false, style = {} , onValueChange = (value: any) => {} }) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const backgroundColor = checked ? primaryColor : greyColor;
  const activeStyle = checked ? styles.active : styles.inactive;

  return (
    <Pressable 
    onPress={()=> {
      console.log('press');
      
      onValueChange(checked)
    }}
    style={[activeStyle, { backgroundColor }, style]}>
      {checked && (
        <Image
          source={require('assets/images/icons/check.png')}
          style={styles.check}
        />
      )}
    </Pressable>
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

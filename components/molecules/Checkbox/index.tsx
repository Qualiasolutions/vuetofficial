import { Text, useThemeColor, View } from 'components/Themed';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, ViewProps } from 'react-native';
const CHECKBOX_HEIGHT = 23;
const CHECKBOX_WIDTH = 23;
const CHECKBOX_RADIUS = 2;

type CheckboxProps = {
  checked?: boolean;
  style?: ViewProps;
  disabled?: boolean;
  smoothChecking?: boolean;
  onValueChange?: (value: any) => Promise<void>;
}

export default function Checkbox({
  checked = false,
  style = {},
  disabled = false,
  smoothChecking = true,
  onValueChange
}: CheckboxProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const [ submitting, setSubmitting ] = useState<boolean>(false)

  const isChecked = smoothChecking ? (submitting && !checked) || (!submitting && checked) : checked
  const backgroundColor = isChecked ? primaryColor : greyColor;
  const activeStyle = isChecked ? styles.active : styles.inactive;

  /*
  In order to smooth the checking, we ensure that it is checked
  from the point of being clicked to the point at which the
  received value of `checked` changes.

  In the event that the `onPress` handler errors, we also call
  setSubmitting(false) so that it isn't forced to be checked.
  */
  useEffect(() => {
    setSubmitting(false)
  }, [ checked ])

  return (
    <Pressable
      onPress={async () => {
        if (onValueChange) {
          if (smoothChecking) {
            setSubmitting(true)
          }
          try {
            await onValueChange(checked);
          } catch (err) {
            setSubmitting(false)
          }
        }
      }}
      disabled={disabled}
      style={[activeStyle, { backgroundColor }, style]}
    >
      {isChecked && (
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

import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import { Feather } from '@expo/vector-icons';
import { elevation } from 'styles/elevation';
import { useThemeColor } from 'components/Themed';

type ListButtonProps = {
  text: string;
  onPress?: () => void;
  style?: ViewStyle;
  iconName?: keyof typeof Feather.glyphMap;
};

export default function ListButton({
  text,
  onPress,
  style = {},
  iconName
}: ListButtonProps) {
  const whiteColor = useThemeColor({}, 'white');
  const almostWhiteColor = useThemeColor({}, 'almostWhite');
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.listEntry,
        style,
        elevation.elevated,
        {
          backgroundColor: pressed ? almostWhiteColor : whiteColor
        }
      ]}
    >
      <BlackText text={text} style={styles.listEntryText} />
      {iconName && <Feather name={iconName} size={25} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listEntryText: {
    fontSize: 18
  }
});

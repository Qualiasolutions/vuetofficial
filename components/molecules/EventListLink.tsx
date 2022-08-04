import React from 'react';
import { Image, Pressable, StyleSheet, ViewStyle } from 'react-native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import Layout from 'constants/Layout';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';

// We will need to add more types here as we use
// this for more sub-navigators
type ListLinkProps = {
  text: string;
  toScreen?:
    | keyof RootTabParamList
    | keyof EntityTabParamList
    | keyof SettingsTabParamList;
  toScreenParams?: object;
  navMethod?: 'push' | 'navigate';
  style?: ViewStyle;
  selected?: boolean;
  customOnPress?: () => void;
  onSelect?: (v: boolean) => Promise<void>;
  subType?: string;
};

export default function EventListLink({
  text,
  toScreen,
  navMethod = 'navigate',
  toScreenParams = {},
  style = {},
  selected = false,
  customOnPress,
  onSelect,
  subType
}: ListLinkProps) {
  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();

  const styleFunc = function () {
    return StyleSheet.create({
      listEntry: {
        width: Layout.window.width - 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1
      },
      listEntryText: {
        fontSize: 18,
        marginLeft: 23
      },
      row: { flexDirection: 'row', alignItems: 'center' },
      check: {
        height: 20,
        width: 13,
        tintColor: useThemeColor({}, 'primary')
      }
    });
  };

  const greyColor = useThemeColor({}, 'grey');
  const primaryColor = useThemeColor({}, 'primary');
  const styles = styleFunc();

  function returnEventImage() {
    switch (subType) {
      case 'food':
        return <Ionicons name="fast-food" color={primaryColor} size={20} />;
      case 'venue':
        return <Feather name="map-pin" color={primaryColor} size={20} />;
      case 'party_favours':
        return <Ionicons name="partly-sunny" color={primaryColor} size={20} />;
      case 'gifts':
        return <Ionicons name="gift" color={primaryColor} size={20} />;
      case 'music':
        return <Ionicons name="musical-note" color={primaryColor} size={20} />;
      case 'decorations':
        return (
          <Ionicons
            name="md-partly-sunny-outline"
            color={primaryColor}
            size={20}
          />
        );
      case 'guest_list':
        return <Ionicons name="person" color={primaryColor} size={20} />;
      case 'add':
        return <Ionicons name="add" color={primaryColor} size={20} />;
      default:
        return (
          <Image
            source={require('assets/images/icons/check.png')}
            style={styles.check}
          />
        );
    }
  }

  return (
    <Pressable
      onPress={() => {
        if (customOnPress) {
          return customOnPress();
        }
        onSelect && onSelect(selected);
      }}
    >
      <WhiteBox
        style={[
          styles.listEntry,
          style,
          selected && { backgroundColor: greyColor },
          !selected && subType != 'add' && { opacity: 0.3 }
        ]}
      >
        <TransparentView style={styles.row}>
          {returnEventImage()}
          <BlackText text={text} style={styles.listEntryText} />
        </TransparentView>

        {subType != 'add' && (
          <Feather
            name={!selected ? 'eye-off' : 'chevron-right'}
            size={!selected ? 25 : 30}
          />
        )}
      </WhiteBox>
    </Pressable>
  );
}

import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import {
  TransparentView,
} from 'components/molecules/ViewComponents';
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

  function returnEventImage() {
    switch (subType) {
      case 'food':
        return (
          <Ionicons
            name="fast-food"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      case 'venue':
        return (
          <Feather
            name="map-pin"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      case 'party_favours':
        return (
          <Ionicons
            name="partly-sunny"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      case 'gifts':
        return (
          <Ionicons
            name="gift"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      case 'music':
        return (
          <Ionicons
            name="musical-note"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      case 'decorations':
        return (
          <Ionicons
            name="md-partly-sunny-outline"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      case 'guest_list':
        return (
          <Ionicons
            name="person"
            color={useThemeColor({}, 'primary')}
            size={20}
          />
        );
      default:
        return <Feather name="map-pin" />;
    }
  }

  return (
    <Pressable onPress={() => {}}>
      <TransparentView style={[styles.listEntry, style]}>
        <TransparentView style={styles.row}>
          {returnEventImage()}
          <BlackText text={text} style={styles.listEntryText} />
        </TransparentView>

        <Feather name="chevron-right" size={30} />
      </TransparentView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    width: Layout.window.width - 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.16,
    elevation: 5,
    backgroundColor:'white',
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1
  },
  listEntryText: {
    fontSize: 18,
    marginLeft: 23
  },
  row: { flexDirection: 'row', alignItems: 'center' }
});

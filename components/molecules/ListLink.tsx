import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';

// We will need to add more types here as we use
// this for more sub-navigators
type ListLinkProps = {
  text: string | Text | JSX.Element;
  toScreen:
    | keyof RootTabParamList
    | keyof EntityTabParamList
    | keyof SettingsTabParamList
    | string;
  toScreenParams?: object;
  navMethod?: 'push' | 'navigate';
  style?: ViewStyle;
  showDot?: boolean;
  dotStyle?: ViewStyle;
};

export default function ListLink({
  text,
  toScreen,
  navMethod = 'navigate',
  toScreenParams = {},
  style = {},
  showDot = false,
  dotStyle = {}
}: ListLinkProps) {
  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();

  return (
    <Pressable
      onPress={() => {
        if (navMethod === 'push') {
          (navigation as any).push(toScreen, toScreenParams);
        } else {
          (navigation.navigate as any)(toScreen, toScreenParams);
        }
      }}
    >
      <WhiteView style={[styles.listEntry, style]}>
        <BlackText text={text} style={styles.listEntryText} />

        <TransparentView style={styles.row}>
          {showDot && <TransparentView style={[styles.dot(), dotStyle]} />}
          <Feather name="chevron-right" size={25} />
        </TransparentView>
      </WhiteView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 10,
    borderRadius: 10
  },
  listEntryText: {
    fontSize: 18
  },
  arrow: {
    width: 15,
    height: 15
  },
  dot: () => ({
    backgroundColor: useThemeColor({}, 'primary'),
    height: 15,
    width: 15,
    borderRadius: 15,
    marginRight: 23
  }),
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

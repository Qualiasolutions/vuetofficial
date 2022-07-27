import React from 'react';
import { Image, Pressable, StyleSheet, ViewStyle } from 'react-native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { WhiteView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

// We will need to add more types here as we use
// this for more sub-navigators
type ListLinkProps = {
  text: string;
  toScreen:
    | keyof RootTabParamList
    | keyof EntityTabParamList
    | keyof SettingsTabParamList;
  toScreenParams?: object;
  navMethod?: 'push' | 'navigate';
  style?: ViewStyle;
};

export default function ListLink({
  text,
  toScreen,
  navMethod = 'navigate',
  toScreenParams = {},
  style = {}
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
        <AlmostBlackText text={text} style={styles.listEntryText} />
        <Image
          source={require('../../assets/images/icons/arrow-right.png')}
          style={styles.arrow}
        />
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
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5
  },
  listEntryText: {
    fontSize: 20
  },
  arrow: {
    width: 15,
    height: 15
  }
});

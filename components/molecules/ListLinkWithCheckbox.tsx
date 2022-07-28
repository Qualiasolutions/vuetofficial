import React from 'react';
import {  Pressable, StyleSheet, ViewStyle } from 'react-native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { TransparentView, WhiteBox, WhiteView } from 'components/molecules/ViewComponents';
import {  BlackText } from 'components/molecules/TextComponents';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import Layout from '../../constants/Layout';
import Checkbox from './Checkbox';
import { Feather } from '@expo/vector-icons';

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
  selected?: boolean
};

export default function ListLinkWithCheckbox({
  text,
  toScreen,
  navMethod = 'navigate',
  toScreenParams = {},
  style = {},
  selected = false
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
      <WhiteBox style={[styles.listEntry, style]}>
       <TransparentView style={styles.row}>
       <Checkbox checked={selected} />
        <BlackText text={text} style={styles.listEntryText} />
       </TransparentView>
 
        <Feather name='chevron-right' size={30} />
      </WhiteBox>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    width: Layout.window.width - 48,
    paddingHorizontal: 20,
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  },
  listEntryText: {
    fontSize: 18,
    marginLeft: 23
  },
  row: {flexDirection: 'row', alignItems:'center'}
});

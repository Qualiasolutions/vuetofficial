import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import ListButton from './ListButton';

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
    <ListButton
      text={text}
      onPress={() => {
        if (navMethod === 'push') {
          (navigation as any).push(toScreen, toScreenParams);
        } else {
          (navigation.navigate as any)(toScreen, toScreenParams);
        }
      }}
      style={StyleSheet.flatten([style, styles.listLink])}
      iconName="chevron-right"
    />
  );
}

const styles = StyleSheet.create({
  listLink: { marginBottom: 3 }
});

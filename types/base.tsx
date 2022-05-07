/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type UnauthorisedStackParamList = {
  Login: undefined;
};

export type UnauthorisedStackScreenProps<
  Screen extends keyof UnauthorisedStackParamList
> = NativeStackScreenProps<UnauthorisedStackParamList, Screen>;

export type UnauthorisedTabParamList = {
  Login: undefined;
};

export type UnauthorisedTabScreenProps<
  Screen extends keyof UnauthorisedTabParamList
> = NativeStackScreenProps<UnauthorisedStackParamList, Screen>;

export type CategoriesStackParamList = {
  CategoriesGrid: { initial: undefined; screen: undefined };
  Transport: undefined;
};

export type CategoriesStackScreenProps<
  Screen extends keyof CategoriesStackParamList
> = NativeStackScreenProps<CategoriesStackParamList, Screen>;

export type CategoriesTabParamList = {
  CategoriesGrid: undefined;
  Transport: undefined;
};

export type CategoriesTabScreenProps<
  Screen extends keyof CategoriesTabParamList
> = NativeStackScreenProps<CategoriesStackParamList, Screen>;

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Categories: { initial: boolean; screen: string };
  Settings: undefined;
  AddTask: undefined;
  Transport: undefined;
  AddEntity: { entityType: string };
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

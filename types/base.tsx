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
import { CategoryName } from './categories';
import { EntityTypeName } from './entities';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Unauthorised Stack
export type UnauthorisedTabParamList = {
  Login: undefined;
  Signup: undefined;
  ValidatePhone: {
    phoneNumber: string;
    validationId: number;
    isEmail?: boolean;
  };
  CreatePassword: {
    phoneNumber: string;
    isEmail?: boolean;
  };
};

export type UnauthorisedTabScreenProps<
  Screen extends keyof UnauthorisedTabParamList
> = NativeStackScreenProps<UnauthorisedTabParamList, Screen>;

// Setup Stack
export type SetupTabParamList = {
  CreateAccount: undefined;
  AddFamily: undefined;
  AddFamilyMember: undefined;
  WelcomeToVuet: undefined;
};

export type SetupTabScreenProps<Screen extends keyof SetupTabParamList> =
  NativeStackScreenProps<SetupTabParamList, Screen>;

// Family Request Stack
export type FamilyRequestTabParamList = {
  FamilyRequest: undefined;
};

export type FamilyRequestTabScreenProps<
  Screen extends keyof FamilyRequestTabParamList
> = NativeStackScreenProps<FamilyRequestTabParamList, Screen>;

// Settings Stack
export type SettingsTabParamList = {
  Settings: undefined;
  FamilySettings: undefined;
  FriendSettings: undefined;
  PersonalAssistant: undefined;
  WhatMyFamilySees: undefined;
  AddingTasks: undefined;
  DayPreferences: undefined;
  BlockedDayPreferences: undefined;
  PreferredDayPreferences: undefined;
  CategoryPreferences: undefined;
  TaskLimits: undefined;
  FlexibleTaskPreferences: undefined;
  Routines: undefined;
  CreateUserInvite: { familyRequest: boolean };
  EditFamilyMember: { id: number | string };
  EditFamilyInvite: { id: number | string };
};

export type SettingsTabScreenProps<Screen extends keyof SettingsTabParamList> =
  NativeStackScreenProps<SettingsTabParamList, Screen>;

// Entity Stack
export type EntityTabParamList = {
  Calendar: undefined;
  References: undefined;
  Home: undefined;
};

export type EntityTabScreenProps<Screen extends keyof EntityTabParamList> =
  NativeStackScreenProps<EntityTabParamList, Screen>;

// Category Stack
export type CategoryTabParamList = {
  Calendar: undefined;
  References: undefined;
  Home: undefined;
};

export type CategoryTabScreenProps<Screen extends keyof CategoryTabParamList> =
  NativeStackScreenProps<CategoryTabParamList, Screen>;

// MyAccount Stack
export type MyAccountTabParamList = {
  MyAccount: undefined;
  EditPhoneNumber: undefined;
  EditAccountType: undefined;
  EditAccountDetails: undefined;
  EditSecurity: undefined;
};
export type MyAccountTabScreenProps<
  Screen extends keyof MyAccountTabParamList
> = NativeStackScreenProps<MyAccountTabParamList, Screen>;

// Content Stack
export type ContentTabParamList = {
  Categories: { initial: boolean; screen: string };
  CategoryPreferences: { categoryId: number };
  CategoryList: { categoryId: number };
  SubCategoryList: { categoryIds: number[] };
  BlockedDaysSettings: { categoryId: number };
  EntityList: {
    entityTypes: EntityTypeName[];
    entityTypeName: string;
    showCreateForm: boolean;
  };
  LinkList: {
    listName: 'annualDates';
  };
  EntityScreen: { entityId: number | string };
  EntityPeriods: { entityId: number };
  ChildEntitiesScreen: {
    entityId: number | string;
    entityTypes: EntityTypeName[];
    showCreateForm: boolean;
  };
  ChildEntitiesCalendarScreen: {
    entityId: number | string;
    entityTypes: EntityTypeName[];
    includeParentTasks?: boolean;
  };
  ChildEntitiesPeriodsScreen: {
    entityId: number | string;
    entityTypes: EntityTypeName[];
    includeParentTasks?: boolean;
  };
  HolidayList: {};
  HolidayDetail: { countrycodes: string[] };
  EditEntity: { entityId: number | string };
  AddEntity: {
    entityTypes: EntityTypeName[];
    parentId?: number | string;
  };
};

// Side Drawer Stack
export type SideNavigatorTabParamList = {
  BottomTabNavigator: undefined;
  SettingsNavigator: undefined;
  MyAccountNavigator: undefined;
  Help: undefined;
  Notifications: undefined;
  Contact: undefined;
};

export type ContentTabScreenProps<Screen extends keyof ContentTabParamList> =
  NativeStackScreenProps<ContentTabParamList, Screen>;

// Root Stack
export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootTabParamList = {
  Home: undefined;
  SettingsNavigator: undefined;
  ContentNavigator: undefined;
  SideNavigator: undefined;
  AddTask: { entityId: number | string };
  PlusButton: undefined;
  EditTask: { taskId: number };
  Transport: undefined;
  NotFound: undefined;
  CalendarScreen: {
    startDate: Date;
    endDate: Date;
  };
  Calendar: {};
  Chat: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type TabParamList = RootTabParamList &
  ContentTabParamList &
  UnauthorisedTabParamList &
  SetupTabParamList &
  FamilyRequestTabParamList &
  SettingsTabParamList &
  MyAccountTabParamList &
  EntityTabParamList &
  CategoryTabParamList;

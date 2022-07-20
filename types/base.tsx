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
  Unauthorised: NavigatorScreenParams<UnauthorisedTabParamList> | undefined;
};

export type UnauthorisedStackScreenProps<
  Screen extends keyof UnauthorisedStackParamList
> = NativeStackScreenProps<UnauthorisedStackParamList, Screen>;

export type UnauthorisedTabParamList = {
  Login: undefined;
  Signup: undefined;
  ValidatePhone: {
    phoneNumber: string;
    validationId: number;
  };
  CreatePassword: {
    phoneNumber: string;
  };
};

export type UnauthorisedTabScreenProps<
  Screen extends keyof UnauthorisedTabParamList
> = NativeStackScreenProps<UnauthorisedTabParamList, Screen>;

export type SetupTabParamList = {
  CreateAccount: undefined;
  AddFamily: undefined;
  AddFamilyMember: undefined;
  WelcomeToVuet: undefined;
};

export type SetupStackParamList = {
  Unauthorised: NavigatorScreenParams<SetupTabParamList> | undefined;
};

export type SetupStackScreenProps<Screen extends keyof SetupStackParamList> =
  NativeStackScreenProps<SetupStackParamList, Screen>;

export type SetupTabScreenProps<Screen extends keyof SetupTabParamList> =
  NativeStackScreenProps<SetupTabParamList, Screen>;

export type FamilyRequestTabParamList = {
  FamilyRequest: undefined;
};

export type FamilyRequestStackParamList = {
  Unauthorised: NavigatorScreenParams<FamilyRequestTabParamList> | undefined;
};

export type FamilyRequestStackScreenProps<
  Screen extends keyof FamilyRequestStackParamList
> = NativeStackScreenProps<FamilyRequestStackParamList, Screen>;

export type FamilyRequestTabScreenProps<
  Screen extends keyof FamilyRequestTabParamList
> = NativeStackScreenProps<FamilyRequestTabParamList, Screen>;

export type SettingsTabParamList = {
  Settings: undefined;
  FamilySettings: undefined;
  AddFamilyMember: undefined;
  EditFamilyMember: { id: number | string };
  EditFamilyInvite: { id: number | string };
};

export type SettingsStackParamList = {
  Unauthorised: NavigatorScreenParams<SettingsTabParamList> | undefined;
};

export type SettingsStackScreenProps<
  Screen extends keyof SettingsStackParamList
> = NativeStackScreenProps<SettingsStackParamList, Screen>;

export type SettingsTabScreenProps<Screen extends keyof SettingsTabParamList> =
  NativeStackScreenProps<SettingsTabParamList, Screen>;

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Categories: { initial: boolean; screen: string };
  EntityTypeList: { categoryId: number };
  EntityList: { entityType: string };
  SettingsNavigator: undefined;
  AddTask: { entityId: number | string };
  CreateTask: undefined;
  EditTask: { taskId: number };
  Transport: undefined;
  AddEntity: { entityType: string };
  EditEntity: { entityId: number | string };
  DeleteSuccess: { entityName: string };
  NotFound: undefined;
  EntityScreen: { entityId: number | string };
  CalendarScreen: {
    startDate: Date;
    endDate: Date;
  };
};

export type TabParamList = RootTabParamList &
  UnauthorisedTabParamList &
  SetupTabParamList &
  FamilyRequestTabParamList &
  SettingsTabParamList;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

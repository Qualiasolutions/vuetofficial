/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { TabParamList } from '../types/base';

const linking: LinkingOptions<TabParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Home: '',
      Transport: 'transport',
      SettingsNavigator: {
        path: 'settings',
        screens: {
          Settings: '',
          FamilySettings: 'family',
          EditFamilyMember: 'edit-family-member',
          EditFamilyInvite: 'edit-family-invite',
          AddFamilyMember: 'add-family-member'
        }
      },
      EntityNavigator: {
        path: 'entities',
        screens: {
          Categories: 'categories-grid',
          EntityTypeList: 'entity-type-list',
          EntityList: 'entity-list',
          EntityScreen: 'entity-screen',
          EditEntity: 'edit-entity',
          AddEntity: 'add-entity',
          ChildEntitiesScreen: 'child-entities-screen',
          HolidayList: 'holiday-list',
          HolidayDetail: 'holiday-detail'
        }
      },
      AddTask: 'add-task',
      EditTask: 'edit-task',
      Login: 'login',
      Signup: 'signup',
      ValidatePhone: 'validate-phone',
      CreatePassword: 'create-password',
      NotFound: '*',
      CreateAccount: 'create-account',
      AddFamily: 'add-family',
      AddFamilyMember: 'add-family-member',
      WelcomeToVuet: 'welcome',
      FamilyRequest: 'family-request'
    }
  }
};

export default linking;

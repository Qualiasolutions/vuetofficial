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
      Home: 'home',
      Categories: 'categories-grid',
      Transport: 'transport',
      Settings: 'settings',
      AddTask: 'add-task',
      EditTask: 'edit-task',
      AddEntity: 'add-entity',
      EditEntity: 'edit-entity',
      EntityScreen: 'entity',
      NotFound: '*',
      Login: 'login',
    }
  }
};

export default linking;

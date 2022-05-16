/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootTabParamList } from '../types/base';

const linking: LinkingOptions<RootTabParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Home: 'home',
      Categories: 'categories-grid',
      Transport: 'transport',
      Settings: 'settings',
      AddTask: 'add-task',
      AddEntity: 'add-entity',
      EditEntity: 'edit-entity',
      DeleteSuccess: 'delete-success',
      NotFound: '*'
    }
  }
};

export default linking;

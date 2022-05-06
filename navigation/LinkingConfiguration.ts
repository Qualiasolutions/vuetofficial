/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types/base';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: '',
          Categories: {
            screens: {
              CategoriesGrid: 'categories-grid',
              Transport: 'transport',
            }
          },
          Settings: 'settings',
          AddTask: 'add-task'
        }
      },
      Modal: 'modal',
      NotFound: '*',
    }
  }
};

export default linking;

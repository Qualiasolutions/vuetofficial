import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text, View } from 'components/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import { selectAllCategories } from 'reduxStore/slices/categories/selectors';
import {
  isSuccessfulResponseType,
  makeAuthorisedRequest
} from 'utils/makeAuthorisedRequest';
import { Category as CategoryType } from 'types/categories';
import { setAllCategories } from 'reduxStore/slices/categories/actions';

import Constants from 'expo-constants';
import { DARK } from 'globalStyles/colorScheme';
import { Link } from '@react-navigation/native';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export default function Transport({ navigation }: any) {
  return null
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridSquare: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
    height: '33%',
    padding: 10,
    borderWidth: 1,
    borderColor: DARK
  },
  gridText: {
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

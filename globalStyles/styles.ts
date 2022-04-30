import { StyleSheet } from 'react-native';

import {
  DARK,
  LIGHT,
  SECONDARY,
  HIGHLIGHT,
  WARNING,
  ERROR
} from './colorScheme';

const GLOBAL_STYLES = StyleSheet.create({
  errorMessage: {
    padding: 10,
    margin: 10,
    color: ERROR
  },
  textInput: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 5,
    width: '80%',
    padding: 10
  }
});

export default GLOBAL_STYLES;

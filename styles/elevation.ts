import { StyleSheet } from 'react-native';

export const elevation = StyleSheet.create({
  elevated: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    elevation: 3
  }
});

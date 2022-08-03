import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.16,
    elevation: 5,
    borderRadius: 10,
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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

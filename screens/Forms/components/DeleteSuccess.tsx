import { Text } from 'components/Themed';
import { StyleSheet } from 'react-native';

export default ({ name }: { name: string }) => {
  return <Text style={styles.message}>Successfully deleted {name}</Text>;
};

const styles = StyleSheet.create({
  message: {
    padding: 30,
    textAlign: 'center',
    fontSize: 20
  }
});

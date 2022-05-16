import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { RootTabParamList } from 'types/base';

export default ({
  route
}: NativeStackScreenProps<RootTabParamList, 'DeleteSuccess'>) => {
  return (
    <Text style={styles.message}>
      Successfully deleted {route.params.entityName}
    </Text>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 30,
    textAlign: 'center',
    fontSize: 20
  }
});

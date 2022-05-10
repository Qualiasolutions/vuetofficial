import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './formFieldTypes';
import GenericForm from 'components/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddEntity'>) {
  const permittedEntityForms = ['Car'];
  if (
    route.params?.entityType &&
    permittedEntityForms.includes(route.params?.entityType)
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>New {route.params.entityType}</Text>
          <GenericForm fields={carForm} url="" method="POST"></GenericForm>
        </View>
      </SafeAreaView>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});

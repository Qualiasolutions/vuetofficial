import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './formFieldTypes';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { setAllEntities } from 'reduxStore/slices/entities/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllEntities } from 'reduxStore/slices/entities/selectors';
import { CarResponseType } from 'types/entities';

export default function AddEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddEntity'>) {
  const dispatch = useDispatch();
  const allEntities = useSelector(selectAllEntities);
  const updateEntities = (res: CarResponseType) => {
    dispatch(setAllEntities([...Object.values(allEntities.byId), res]));
  };

  const permittedEntityForms = ['Car'];
  if (
    route.params?.entityType &&
    permittedEntityForms.includes(route.params?.entityType)
  ) {
    console.log(carForm);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>New {route.params.entityType}</Text>
          <GenericForm
            fields={carForm}
            url={makeApiUrl(`/core/entity/`)}
            formType="CREATE"
            extraFields={{
              resourcetype: route.params.entityType
            }}
            onSubmitSuccess={updateEntities}
            clearOnSubmit={true}
          ></GenericForm>
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
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

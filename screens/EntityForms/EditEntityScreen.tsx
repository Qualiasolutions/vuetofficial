import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm, FormFieldTypes } from './formFieldTypes';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { setAllEntities } from 'reduxStore/slices/entities/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllEntities } from 'reduxStore/slices/entities/selectors';
import { CarResponseType } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useState } from 'react';
import DeleteSuccess from './DeleteSuccess';
import { useFocusEffect } from '@react-navigation/native';

export default function EditEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditEntity'>) {
  const dispatch = useDispatch();
  const allEntities = useSelector(selectAllEntities);
  const [deleteSuccessful, setDeleteSuccessful] = useState<boolean>(false)
  const [deletedEntityName, setDeletedEntityName] = useState<string>('')

  useFocusEffect(
    useCallback(() => {
      setDeletedEntityName('')
      setDeleteSuccessful(false)
    }, [])
  )

  const updateEntities = (res: CarResponseType) => {
    dispatch(
      setAllEntities([
        ...Object.values({
          ...allEntities.byId,
          [route.params.entityId]: res
        })
      ])
    );
  };

  const onDeleteSuccess = (res: CarResponseType) => {
    const entityName = allEntities.byId[route.params.entityId].name;
    dispatch(
      setAllEntities([
        ...Object.values({
          ...allEntities.byId
        }).filter((entity) => entity.id !== route.params.entityId)
      ])
    );

    setDeleteSuccessful(true)
    setDeletedEntityName(entityName)
  };

  if (deleteSuccessful) {
    return <DeleteSuccess entityName={deletedEntityName}></DeleteSuccess>
  }

  if (route.params?.entityId && allEntities.byId[route.params.entityId]) {
    const entityToEdit = allEntities.byId[route.params.entityId];
    const formFields = deepCopy<FormFieldTypes>(carForm);

    for (const fieldName in carForm) {
      if (fieldName in entityToEdit) {
        formFields[fieldName].initialValue = entityToEdit[fieldName] || null;
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit {entityToEdit.name}</Text>
          <GenericForm
            fields={formFields}
            url={makeApiUrl(`/core/entity/${entityToEdit.id}/`)}
            formType="UPDATE"
            extraFields={{
              resourcetype: entityToEdit.resourcetype
            }}
            onSubmitSuccess={updateEntities}
            onDeleteSuccess={onDeleteSuccess}
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

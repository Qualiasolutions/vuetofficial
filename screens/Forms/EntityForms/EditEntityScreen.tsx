import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './entityFormFieldTypes';
import { FormFieldTypes } from '../formFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { setAllEntities } from 'reduxStore/slices/entities/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllEntities } from 'reduxStore/slices/entities/selectors';
import { CarResponseType } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useState } from 'react';
import DeleteSuccess from '../components/DeleteSuccess';
import { useFocusEffect } from '@react-navigation/native';

export default function EditEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditEntity'>) {
  const dispatch = useDispatch();
  const allEntities = useSelector(selectAllEntities);
  const [deleteSuccessful, setDeleteSuccessful] = useState<boolean>(false);
  const [deletedEntityName, setDeletedEntityName] = useState<string>('');
  const [updatedSuccessfully, setUpdatedSuccessfully] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setDeletedEntityName('');
      setDeleteSuccessful(false);
      setUpdatedSuccessfully(false);
    }, [])
  );

  const updateEntities = (res: CarResponseType) => {
    dispatch(
      setAllEntities([
        ...Object.values({
          ...allEntities.byId,
          [route.params.entityId]: res
        })
      ])
    );
    setUpdatedSuccessfully(true);
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

    setDeleteSuccessful(true);
    setDeletedEntityName(entityName);
  };

  if (deleteSuccessful) {
    return <DeleteSuccess name={deletedEntityName}></DeleteSuccess>;
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
      <SafeAreaView style={formStyles.container}>
        <View style={formStyles.container}>
          <Text style={formStyles.title}>Edit {entityToEdit.name}</Text>
          {updatedSuccessfully ? (
            <Text>Successfully updated {entityToEdit.name}</Text>
          ) : null}
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

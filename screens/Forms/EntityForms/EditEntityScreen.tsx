import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from './entityFormFieldTypes';
import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { CarResponseType } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useState } from 'react';
import DeleteSuccess from '../components/DeleteSuccess';
import { useFocusEffect } from '@react-navigation/native';
import {
  useGetAllEntitiesQuery,
  useGetAllTasksQuery
} from 'reduxStore/services/api';
import GenericError from 'components/molecules/GenericError';

export default function EditEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditEntity'>) {
  const {
    data: allEntities,
    isLoading,
    error,
    refetch: fetchEntities
  } = useGetAllEntitiesQuery();
  const { refetch: fetchTasks } = useGetAllTasksQuery();
  const formFields = deepCopy<FormFieldTypes>(carForm());
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

  if (isLoading || !allEntities || !route.params.entityId) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entityToEdit = allEntities.byId[entityId];

  const updateEntities = (res: CarResponseType) => {
    fetchEntities();
    fetchTasks();
    setUpdatedSuccessfully(true);
  };

  const onDeleteSuccess = (res: CarResponseType) => {
    const entityName = allEntities.byId[entityId].name;
    fetchEntities();
    setDeletedEntityName(entityName);
    setDeleteSuccessful(true);
  };

  if (deleteSuccessful) {
    return <DeleteSuccess name={deletedEntityName}></DeleteSuccess>;
  }

  if (route.params?.entityId && allEntities.byId[entityId]) {
    for (const fieldName in formFields) {
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

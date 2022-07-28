import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { carForm } from '../../../components/forms/entityFormFieldTypes/car';
import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { formStyles } from '../../../components/forms/formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarResponseType } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useState } from 'react';
import DeleteSuccess from '../components/DeleteSuccess';
import { useFocusEffect } from '@react-navigation/native';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import {
  useDeleteEntityMutation,
  useGetAllEntitiesQuery,
  useUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

export default function EditEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditEntity'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);
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

  const onDeleteSuccess = (res: CarResponseType) => {
    const entityName = allEntities.byId[entityId].name;
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
          <Text style={formStyles.title}>
            {t('screens.editEntity.title', { entityName: entityToEdit.name })}
          </Text>
          {updatedSuccessfully ? (
            <Text>
              {t('screens.editEntity.updateSuccess', {
                entityName: entityToEdit.name
              })}
            </Text>
          ) : null}
          <RTKForm
            fields={formFields}
            methodHooks={{
              PATCH: useUpdateEntityMutation,
              DELETE: useDeleteEntityMutation
            }}
            formType="UPDATE"
            extraFields={{
              resourcetype: entityToEdit.resourcetype,
              id: entityToEdit.id
            }}
            onSubmitSuccess={() => {
              setUpdatedSuccessfully(true);
            }}
            onDeleteSuccess={onDeleteSuccess}
          />
        </View>
      </SafeAreaView>
    );
  }
  return null;
}

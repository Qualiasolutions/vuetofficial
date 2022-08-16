
import { Text } from 'components/Themed';
import { FormFieldTypes } from 'components/forms/formFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { CarResponseType } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import * as forms from 'components/forms/entityFormFieldTypes';
import { TransparentView } from 'components/molecules/ViewComponents';
import { inlineFieldsMapping } from './utils/inlineFieldsMapping'

export default function EditEntityForm({
  entityId,
}: {
  entityId: number;
}) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();
  const navigation = useNavigation()

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const entityForms = {
    Car: forms.car(),
    Birthday: forms.birthday(),
    Event: forms.event(),
    Hobby: forms.hobby(),
    List: forms.list(),
    Trip: forms.trip(),
    TripTransport: forms.tripTransport(),
    TripAccommodation: forms.tripAccommodation(),
    TripActivity: forms.tripActivity(),
    Pet: forms.pet(),
    DaysOff: forms.daysOff()
  };

  const [updatedSuccessfully, setUpdatedSuccessfully] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setUpdatedSuccessfully(false);
    }, [])
  );

  if (isLoading || !allEntities || !entityId) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const entityToEdit = allEntities.byId[entityId];

  const formFields = deepCopy<FormFieldTypes>(
    entityForms[entityToEdit?.resourcetype]
  );

  const onDeleteSuccess = (res: CarResponseType) => {
    navigation.goBack();
  };

  if (entityId && allEntities.byId[entityId]) {
    for (const fieldName in formFields) {
      if (fieldName in entityToEdit) {
        formFields[fieldName].initialValue = entityToEdit[fieldName] || null;
      }
    }

    return (
      <TransparentView>
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
          clearOnSubmit={false}
          inlineFields={(inlineFieldsMapping[entityToEdit?.resourcetype] || inlineFieldsMapping.default) as boolean}
        />
      </TransparentView>
    );
  }
  return null;
}

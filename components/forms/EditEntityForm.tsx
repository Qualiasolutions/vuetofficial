import { Text, useThemeColor } from 'components/Themed';
import { FormFieldTypes, ImageField } from 'components/forms/formFieldTypes';
import RTKForm, { FormDataType } from 'components/forms/RTKForm';
import { CarResponseType, EntityTypeName } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import {
  useDeleteEntityMutation,
  useGetAllEntitiesQuery,
  useUpdateEntityMutation,
  useFormUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import forms from './entityFormFieldTypes';
import { TransparentView } from 'components/molecules/ViewComponents';
import { inlineFieldsMapping } from './utils/inlineFieldsMapping';
import { dataTypeMapping } from './utils/dataTypeMapping';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { fieldColorMapping } from './utils/fieldColorMapping';
import { derivedFieldsMapping } from './utils/derivedFieldsMapping';

export default function EditEntityForm({ entityId }: { entityId: number }) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const entityForms: { [key in EntityTypeName]?: FormFieldTypes } = forms();

  const [updatedSuccessfully, setUpdatedSuccessfully] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setUpdatedSuccessfully(false);
    }, [])
  );

  const entityToEdit = allEntities?.byId ? allEntities.byId[entityId] : null;

  const fieldColor = entityToEdit
    ? useThemeColor(
        {},
        fieldColorMapping[entityToEdit.resourcetype] ||
          fieldColorMapping.default
      )
    : '';

  if (isLoading || !entityToEdit || !allEntities || !entityId) {
    return <FullPageSpinner />;
  }

  if (error) {
    return <GenericError />;
  }

  const formFields = deepCopy<FormFieldTypes>(
    entityForms[entityToEdit.resourcetype] as FormFieldTypes
  );

  const dataType =
    entityToEdit?.resourcetype &&
    ((dataTypeMapping[entityToEdit?.resourcetype] ||
      dataTypeMapping.default) as FormDataType);

  const onDeleteSuccess = (res: CarResponseType) => {
    navigation.goBack();
  };

  if (entityId && allEntities.byId[entityId]) {
    for (const fieldName in formFields) {
      if (Object.keys(formFields[fieldName]).includes('sourceField')) {
        formFields[fieldName].initialValue =
          entityToEdit[(formFields[fieldName] as ImageField).sourceField] ||
          null;
      } else if (fieldName in entityToEdit) {
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
            PATCH:
              dataType === 'form'
                ? useFormUpdateEntityMutation
                : useUpdateEntityMutation,
            DELETE: useDeleteEntityMutation
          }}
          formType="UPDATE"
          extraFields={{
            resourcetype: entityToEdit.resourcetype,
            id: entityToEdit.id
          }}
          derivedFieldsFunction={
            derivedFieldsMapping[entityToEdit.resourcetype]
          }
          onSubmitSuccess={() => {
            setUpdatedSuccessfully(true);
          }}
          onDeleteSuccess={onDeleteSuccess}
          clearOnSubmit={false}
          inlineFields={
            (entityToEdit.resourcetype in inlineFieldsMapping
              ? inlineFieldsMapping[entityToEdit.resourcetype]
              : inlineFieldsMapping.default) as boolean
          }
          fieldColor={fieldColor}
          formDataType={dataType}
        />
      </TransparentView>
    );
  }
  return null;
}

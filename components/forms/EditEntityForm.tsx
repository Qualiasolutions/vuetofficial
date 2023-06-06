import { useThemeColor } from 'components/Themed';
import { FormFieldTypes, ImageField } from 'components/forms/formFieldTypes';
import RTKForm, { FormDataType } from 'components/forms/RTKForm';
import { EntityTypeName } from 'types/entities';
import { deepCopy } from 'utils/copy';
import { useNavigation } from '@react-navigation/native';

import {
  useDeleteEntityMutation,
  useGetAllEntitiesQuery,
  useUpdateEntityMutation,
  useFormUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import forms from './entityFormFieldTypes';
import { TransparentView } from 'components/molecules/ViewComponents';
import { inlineFieldsMapping } from './utils/inlineFieldsMapping';
import { dataTypeMapping } from './utils/dataTypeMapping';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { fieldColorMapping } from './utils/fieldColorMapping';
import { derivedFieldsMapping } from './utils/derivedFieldsMapping';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function EditEntityForm({ entityId }: { entityId: number }) {
  const navigation = useNavigation();

  const { data: allEntities, isLoading, error } = useGetAllEntitiesQuery();

  const entityForms: { [key in EntityTypeName]?: FormFieldTypes } = forms(true);

  const entityToEdit = allEntities?.byId ? allEntities.byId[entityId] : null;

  const fieldColor = useThemeColor(
    {},
    entityToEdit
      ? fieldColorMapping[entityToEdit.resourcetype] ||
          fieldColorMapping.default
      : fieldColorMapping.default
  );

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

  const onDeleteSuccess = () => {
    Toast.show({
      type: 'success',
      text1: 'Succesfully deleted entity'
    });
    navigation.goBack();
  };

  const flatFields = Array.isArray(formFields)
    ? formFields.reduce((a, b) => ({ ...a, ...b }))
    : formFields;

  if (entityId && allEntities.byId[entityId]) {
    for (const fieldName in flatFields) {
      if (Object.keys(flatFields[fieldName]).includes('sourceField')) {
        flatFields[fieldName].initialValue =
          entityToEdit[(flatFields[fieldName] as ImageField).sourceField] ||
          null;
      } else if (fieldName in entityToEdit) {
        flatFields[fieldName].initialValue = entityToEdit[fieldName] || null;
      }
    }

    return (
      <TransparentView>
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
            Toast.show({
              type: 'success',
              text1: `Succesfully updated ${entityToEdit.name}`
            });
            navigation.goBack();
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

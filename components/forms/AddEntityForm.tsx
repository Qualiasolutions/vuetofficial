import React from 'react';
import { useThemeColor } from 'components/Themed';
import RTKForm, { FormDataType } from 'components/forms/RTKForm';
import { useNavigation } from '@react-navigation/native';
import GenericError from 'components/molecules/GenericError';
import {
  useCreateEntityMutation,
  useFormCreateEntityMutation,
  useGetAllEntitiesQuery
} from 'reduxStore/services/api/entities';
import { useTranslation } from 'react-i18next';
import { EntityResponseType, EntityTypeName } from 'types/entities';
import { TransparentView } from 'components/molecules/ViewComponents';
import { inlineFieldsMapping } from './utils/inlineFieldsMapping';
import { fieldColorMapping } from './utils/fieldColorMapping';
import { dataTypeMapping } from './utils/dataTypeMapping';
import { derivedFieldsMapping } from './utils/derivedFieldsMapping';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import useForm from './entityFormFieldTypes/useForm';

type FieldsMapping = {
  [key in EntityTypeName]?: (parent: EntityResponseType | null) => any;
};

const extraFieldsMapping = {
  Holiday: () => ({
    custom: true
  })
} as FieldsMapping;

export default function AddEntityForm({
  entityType,
  parentId
}: {
  entityType: EntityTypeName;
  parentId?: number;
}) {
  const navigation = useNavigation();

  const entityForm = useForm(entityType, false);
  const { t } = useTranslation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(null as any);

  const fieldColor = useThemeColor(
    {},
    fieldColorMapping[entityType] || fieldColorMapping.default
  );

  const dataType =
    entityType &&
    ((dataTypeMapping[entityType] || dataTypeMapping.default) as FormDataType);

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const parentEntity = parentId ? allEntities.byId[parentId] : null;

  const extraFieldsFunction = extraFieldsMapping[entityType];
  const computedExtraFields = extraFieldsFunction
    ? extraFieldsFunction(parentEntity)
    : {};
  const extraFields = {
    ...computedExtraFields,
    resourcetype: entityType
  } as any;

  if (parentId) {
    extraFields.parent = parentId;
  }

  return (
    <TransparentView>
      <RTKForm
        fields={entityForm || {}}
        methodHooks={{
          POST:
            dataType === 'form'
              ? useFormCreateEntityMutation
              : useCreateEntityMutation
        }}
        formType="CREATE"
        extraFields={extraFields}
        derivedFieldsFunction={derivedFieldsMapping[entityType]}
        onSubmitSuccess={() => {
          Toast.show({
            type: 'success',
            text1: t('screens.addEntity.createSuccess', {
              entityType: t(`entityResourceTypeNames.${entityType}`)
            })
          });
          navigation.goBack();
        }}
        clearOnSubmit={true}
        inlineFields={
          (entityType in inlineFieldsMapping
            ? inlineFieldsMapping[entityType]
            : inlineFieldsMapping.default) as boolean
        }
        createTextOverride={t('common.save')}
        fieldColor={fieldColor}
        formDataType={dataType}
      />
    </TransparentView>
  );
}

import { useThemeColor } from 'components/Themed';
import RTKForm, { FormDataType } from 'components/forms/RTKForm';
import { useNavigation } from '@react-navigation/native';

import {
  useDeleteEntityMutation,
  useUpdateEntityMutation,
  useFormUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import { TransparentView } from 'components/molecules/ViewComponents';
import { inlineFieldsMapping } from './utils/inlineFieldsMapping';
import { dataTypeMapping } from './utils/dataTypeMapping';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { fieldColorMapping } from './utils/fieldColorMapping';
import { derivedFieldsMapping } from './utils/derivedFieldsMapping';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import useForm from './entityFormFieldTypes/useForm';
import { useSelector } from 'react-redux';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { ViewStyle } from 'react-native';

export default function EditEntityForm({
  entityId,
  style,
  onSubmitSuccess
}: {
  entityId: number;
  style?: ViewStyle;
  onSubmitSuccess?: () => void;
}) {
  const navigation = useNavigation();

  const entityToEdit = useSelector(selectEntityById(entityId));

  const formFields = useForm(entityToEdit?.resourcetype || 'Car', true); // Could use any default entity type here

  const fieldColor = useThemeColor(
    {},
    entityToEdit
      ? fieldColorMapping[entityToEdit.resourcetype] ||
          fieldColorMapping.default
      : fieldColorMapping.default
  );

  if (!entityToEdit || !entityId) {
    return <FullPageSpinner />;
  }

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

  if (entityToEdit) {
    for (const fieldName in flatFields) {
      if (Object.keys(flatFields[fieldName]).includes('sourceField')) {
        const sourceField = flatFields[fieldName].sourceField || fieldName;
        flatFields[fieldName].initialValue = entityToEdit[sourceField] || null;
      } else if (fieldName in entityToEdit) {
        flatFields[fieldName].initialValue = entityToEdit[fieldName] || null;
      }
    }

    return (
      <TransparentView style={style || {}}>
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
            if (onSubmitSuccess) {
              onSubmitSuccess();
            }
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

import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

export const petForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.pet.name')
    },
    type: {
      type: 'dropDownWithOther',
      required: true,
      displayName: t('entities.pet.type'),
      permittedValues: [
        {label: 'Dog', value: 'Dog'},
        {label: 'Cat', value: 'Cat'},
        {label: 'Bird', value: 'Bird'}
      ]
    },
    breed: {
      type: 'string',
      required: true,
      displayName: t('entities.pet.breed')
    },
    dob: {
      type: 'Date',
      required: true,
      displayName: t('entities.pet.dob')
    }
    // TODO - add foreign key picker so that we can pick
    // a vet, walker, grommer, sitter, insurance policy
  };
};

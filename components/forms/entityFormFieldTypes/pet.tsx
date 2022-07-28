import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

export const petForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    type: {
      type: 'string',
      required: true,
      displayName: t('entities.pet.type')
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
    },
    microchip_number: {
      type: 'string',
      required: true,
      displayName: t('entities.pet.microchip_number')
    }
    // TODO - add foreign key picker so that we can pick
    // a vet, walker, grommer, sitter, insurance policy
  };
};

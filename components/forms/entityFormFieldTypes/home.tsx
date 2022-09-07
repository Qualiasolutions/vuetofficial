import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

export const homeForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    address: {
      type: 'string',
      required: true,
      displayName: t('entities.home.address')
    },
    residence_type: {
      type: 'dropDown',
      required: true,
      displayName: t('entities.home.residence_type'),
      permittedValues: [
        { label: 'Residence', value: 'RESIDENCE' },
        { label: 'Second Home', value: 'SECOND_HOME' },
        { label: 'Investment', value: 'INVESTMENT' }
      ],
      listMode: 'MODAL'
    },
    house_type: {
      type: 'dropDown',
      required: true,
      displayName: t('entities.home.house_type'),
      permittedValues: [
        { label: 'House', value: 'HOUSE' },
        { label: 'Apartment', value: 'APARTMENT' },
      ],
      listMode: 'MODAL'
    },
    has_outside_area: {
      type: 'dropDown',
      required: true,
      displayName: t('entities.home.has_outside_area'),
      permittedValues: [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ],
      listMode: 'MODAL'
    }
    // TODO - add foreign key picker so that we can pick
    // a vet, walker, grommer, sitter, insurance policy
  };
};

import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

const ACCOMMODATION_TYPE_PERMITTED_VALUES = [
    { id: 'HOTEL' },
    { id: 'OTHER' }
]

export const tripAccommodationForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    accommodation_type: {
      type: 'radio',
      required: true,
      permittedValues: ACCOMMODATION_TYPE_PERMITTED_VALUES,
      valueToDisplay: (val: any) => val.id,
      displayName: t('entities.trip-accommodation.accommodation_type')
    },
    carrier: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-accommodation.carrier')
    },
    confirmation_number: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-accommodation.confirmation_number')
    },
    checkin_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-accommodation.checkin_datetime')
    },
    checkout_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-accommodation.checkout_datetime')
    },
  };
};

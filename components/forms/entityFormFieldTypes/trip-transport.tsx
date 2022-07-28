import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

const TRANPORT_TYPE_PERMITTED_VALUES = [
  { id: 'FLIGHT' },
  { id: 'TRAIN' },
  { id: 'CAR' },
  { id: 'OTHER' }
];

export const tripTransportForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    transport_type: {
      type: 'radio',
      required: true,
      permittedValues: TRANPORT_TYPE_PERMITTED_VALUES,
      valueToDisplay: (val: any) => val.id,
      displayName: t('entities.trip-transport.transport_type')
    },
    flight_number: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-transport.flight_number')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-transport.start_datetime')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-transport.end_datetime')
    }
  };
};

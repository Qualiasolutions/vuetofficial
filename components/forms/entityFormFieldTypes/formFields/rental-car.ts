import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';

export const rentalCarForm = (
  isEdit: boolean,
  t: TFunction
): FormFieldTypes => {
  return {
    carrier: {
      type: 'string',
      required: true,
      displayName: t('entities.mode-of-transport.carrier')
    },
    booking_number: {
      type: 'string',
      required: false,
      displayName: t('entities.rental-car.booking_number')
    },
    start_location: {
      type: 'string',
      required: true,
      displayName: t('entities.rental-car.start_location')
    },
    end_location: {
      type: 'string',
      required: true,
      displayName: t('entities.rental-car.end_location')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.mode-of-transport.start_datetime')
    },
    start_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.mode-of-transport.start_timezone')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.mode-of-transport.end_datetime')
    },
    end_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.mode-of-transport.end_timezone')
    },
    members: {
      type: 'addMembers',
      required: true,
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.entity.members')
    }
  };
};

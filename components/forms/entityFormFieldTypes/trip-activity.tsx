import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

export const tripActivityForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-activity.name')
    },
    company: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-activity.company')
    },
    confirmation_number: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-activity.confirmation_number')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-activity.start_datetime')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-activity.end_datetime')
    },
    contact_phone: {
      type: 'phoneNumber',
      required: true,
      displayName: t('entities.trip-activity.contact_phone')
    },
    contact_email: {
      type: 'string',
      required: true,
      displayName: t('entities.trip-activity.contact_email')
    }
  };
};

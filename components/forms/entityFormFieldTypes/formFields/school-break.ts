import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';

export const schoolBreakForm = (
  isEdit: boolean,
  t: TFunction
): FormFieldTypes => {
  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.school-break.name')
    },
    start_date: {
      type: 'Date',
      required: true,
      displayName: t('entities.school-break.start_date'),
      associatedEndDateField: 'end_date'
    },
    end_date: {
      type: 'Date',
      required: true,
      displayName: t('entities.school-break.end_date'),
      associatedStartDateField: 'start_date'
    }
  };
};

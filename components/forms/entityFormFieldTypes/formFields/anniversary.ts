import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';

export const anniversaryForm = (
  isEdit: boolean,
  t: TFunction
): FormFieldTypes => {
  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    start_date: {
      type: 'OptionalYearDate',
      required: true,
      displayName: t('entities.anniversary.start_date'),
      knownYearField: 'known_year'
    },
    members: {
      type: 'addMembers',
      required: true,
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.anniversary.members')
    }
  };
};

import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';
import { UserFullResponse } from 'types/users';

export const anniversaryForm = (
  isEdit: boolean,
  userFullDetails: UserFullResponse,
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
      type: 'addFamilyMembers',
      required: true,
      permittedValues: userFullDetails?.family?.users || [],
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.anniversary.members')
    }
  };
};

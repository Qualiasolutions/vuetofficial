import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';
import { UserFullResponse } from 'types/users';

export const birthdayForm = (
  isEdit: boolean,
  userFullDetails: UserFullResponse,
  t: TFunction
): FormFieldTypes => {
  return {
    first_name: {
      type: 'string',
      required: true,
      displayName: t('entities.birthday.first_name')
    },
    last_name: {
      type: 'string',
      required: true,
      displayName: t('entities.birthday.last_name')
    },
    start_date: {
      type: 'OptionalYearDate',
      required: true,
      displayName: t('entities.birthday.start_date'),
      knownYearField: 'known_year'
    },
    members: {
      type: 'addFamilyMembers',
      required: true,
      permittedValues: userFullDetails?.family?.users || [],
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.birthday.members')
    }
  };
};

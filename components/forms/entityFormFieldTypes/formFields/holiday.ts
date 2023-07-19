import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';
import { UserFullResponse } from 'types/users';

export const holidayForm = (
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
      type: 'Date',
      required: true,
      displayName: t('entities.holiday.start_date')
    },
    members: {
      type: 'addMembers',
      required: true,
      permittedValues: {
        family: userFullDetails?.family?.users || [],
        friends: userFullDetails?.friends || []
      },
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.entity.members')
    }
  };
};

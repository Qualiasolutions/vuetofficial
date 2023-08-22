import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';
import { EntityResponseType } from 'types/entities';
import { UserFullResponse } from 'types/users';

export const studentForm = (
  isEdit: boolean,
  userFullDetails: UserFullResponse,
  schools: EntityResponseType[],
  t: TFunction
): FormFieldTypes => {
  const schoolOptions = schools.map((school) => ({
    label: school.name,
    value: school.id
  }));
  return {
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
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
    },
    school_attended: {
      type: 'dropDown',
      required: false,
      permittedValues: schoolOptions,
      displayName: t('entities.student.school_attended'),
      listMode: 'MODAL'
    }
  };
};

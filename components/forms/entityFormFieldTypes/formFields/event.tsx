import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { TFunction } from 'i18next';
import { UserFullResponse } from 'types/users';

export const eventForm = (
  isEdit: boolean,
  userFullDetails: UserFullResponse,
  t: TFunction
): FormFieldTypes => {
  return {
    image: {
      type: 'Image',
      required: false,
      displayName: t('entities.entity.image'),
      sourceField: 'presigned_image_url'
    },
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.event.start_datetime'),
      associatedEndTimeField: 'end_datetime'
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.event.end_datetime'),
      associatedStartTimeField: 'start_datetime'
    },
    notes: {
      type: 'TextArea',
      required: true,
      displayName: t('entities.entity.description')
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

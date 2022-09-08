import { FormFieldTypes } from 'components/forms/formFieldTypes';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useTranslation } from 'react-i18next';

export const tripActivityForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = getUserFullDetails();

  return {
    type: {
      type: 'dropDownWithOther',
      required: true,
      displayName: t('entities.trip-activity.type'),
      permittedValues: [
        { label: 'Activity', value: 'Activity' },
        { label: 'Dining', value: 'Dining' }
      ],
      listMode: 'MODAL'
    },
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    address: {
      type: 'TextArea',
      required: false,
      displayName: t('entities.trip-activity.address')
    },
    contact_info: {
      type: 'string',
      required: false,
      displayName: t('entities.trip-activity.contact_info')
    },
    notes: {
      type: 'string',
      required: false,
      displayName: t('entities.entity.notes')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-activity.start_datetime')
    },
    start_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.trip-activity.start_timezone')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.trip-activity.end_datetime')
    },
    end_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.trip-activity.end_timezone')
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

import {
  Field,
  FlatFormFieldTypes,
  FormFieldTypes
} from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const taskTopFieldTypes = (): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

  return {
    title: {
      type: 'string',
      required: true,
      displayName: t('tasks.task.title')
    },
    members: {
      type: 'addMembers',
      required: true,
      permittedValues: {
        family: userFullDetails?.family?.users || [],
        friends: userFullDetails?.friends || []
      },
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('tasks.task.members')
    }
  };
};

export const periodFieldTypes = (): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

  const reminderDropDownField = {
    type: 'dropDown',
    permittedValues: [
      {
        label: '1 day before',
        value: '1 day, 0:00:00'
      },
      {
        label: '1 week before',
        value: '7 days, 0:00:00'
      },
      {
        label: '2 weeks before',
        value: '14 days, 0:00:00'
      },
      {
        label: '4 weeks before',
        value: '28 days, 0:00:00'
      }
    ],
    required: false,
    displayName: t('entities.entity.reminder'),
    listMode: 'MODAL'
  } as Field;

  return {
    title: {
      type: 'string',
      required: true,
      displayName: t('tasks.task.title')
    },
    members: {
      type: 'addMembers',
      required: true,
      permittedValues: {
        family: userFullDetails?.family?.users || [],
        friends: userFullDetails?.friends || []
      },
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('tasks.task.members')
    },
    start_date: {
      type: 'Date',
      required: true,
      displayName: t('tasks.due_date.date')
    },
    reminder_timedelta: reminderDropDownField
  };
};

export const taskMiddleFieldTypes = (disabledRecurrenceFields: boolean = false): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('tasks.task.start_datetime'),
      disabled: disabledRecurrenceFields,
      associatedEndTimeField: 'end_datetime'
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('tasks.task.end_datetime'),
      disabled: disabledRecurrenceFields,
      associatedStartTimeField: 'start_datetime'
    },
    duration_minutes: {
      type: 'calculatedDuration',
      displayName: t('tasks.task.duration_minutes'),
      disabled: true,
      required: false,
      startFieldName: 'start_datetime',
      endFieldName: 'end_datetime'
    },
    recurrence: {
      type: 'recurrenceSelector',
      required: false,
      firstOccurrenceField: 'start_datetime',
      displayName: t('tasks.task.recurrence'),
      disabled: disabledRecurrenceFields
    },
    reminders: {
      type: 'multiRecurrenceSelector',
      required: false,
      reverse: true,
      firstOccurrenceField: 'start_datetime',
      displayName: t('tasks.task.reminders'),
      disabled: disabledRecurrenceFields,
      max: 3
    }
  };
};

export const taskBottomFieldTypes = (): FlatFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    location: {
      type: 'string',
      required: false,
      displayName: t('tasks.task.location')
    },
    contact_name: {
      type: 'string',
      required: false,
      displayName: t('tasks.task.contact_name')
    },
    contact_email: {
      type: 'string',
      required: false,
      displayName: t('tasks.task.contact_email')
    },
    contact_number: {
      type: 'phoneNumber',
      required: false,
      displayName: t('tasks.task.contact_number')
    },
    notes: {
      type: 'TextArea',
      required: false,
      displayName: t('tasks.task.notes')
    }
  };
};

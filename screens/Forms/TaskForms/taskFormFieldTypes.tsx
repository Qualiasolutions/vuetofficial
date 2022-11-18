import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const taskTopFieldTypes = (
  disabledRecurrenceFields: boolean = false
): FormFieldTypes => {
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
    },
    duration_minutes: {
      type: 'dropDown',
      required: true,
      permittedValues: [
        { label: '5 Minutes', value: 5 },
        { label: '15 Minutes', value: 15 },
        { label: '30 Minutes', value: 30 },
        { label: '1 Hour', value: 60 }
      ],
      displayName: t('tasks.task.duration_minutes'),
      listMode: 'MODAL',
      disabled: disabledRecurrenceFields
    },
    recurrence: {
      type: 'dropDown',
      required: false,
      permittedValues: [
        { label: 'None', value: null },
        { label: 'Daily', value: 'DAILY' },
        { label: 'Weekly', value: 'WEEKLY' },
        { label: 'Fortnightly', value: 'FORTNIGHTLY' },
        { label: 'Every 4 Weeks', value: 'EVERY_4_WEEKS' },
        { label: 'Monthly', value: 'MONTHLY' },
        { label: 'Yearly', value: 'YEARLY' }
      ],
      displayName: t('tasks.task.recurrence'),
      placeholder: 'None',
      listMode: 'MODAL',
      disabled: disabledRecurrenceFields
    }
  };
};

export const periodFieldTypes = (): FormFieldTypes => {
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
    },
    start_date: {
      type: 'Date',
      required: true,
      displayName: t('tasks.due_date.date')
    }
  };
};

export const taskRecurrentMiddleFieldTypes = (
  disabledRecurrenceFields: boolean = false
): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('tasks.task.first_start_datetime'),
      disabled: disabledRecurrenceFields
    }
  };
};

export const taskOneOffMiddleFieldTypes = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('tasks.task.start_datetime')
    }
  };
};

export const taskBottomFieldTypes = (): FormFieldTypes => {
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

const taskFieldTypes = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    title: {
      type: 'string',
      required: true,
      displayName: t('tasks.task.title')
    },
    location: {
      type: 'string',
      required: false
    },
    contact_name: {
      type: 'string',
      required: false
    },
    contact_email: {
      type: 'string',
      required: false
    },
    contact_number: {
      type: 'phoneNumber',
      required: false
    },
    notes: {
      type: 'string',
      required: false
    }
  };
};

export const fixedTaskForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const username = useSelector(selectUsername);
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userDetailsError
  } = useGetUserDetailsQuery(username);
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1);

  const baseTaskFieldsTypes = taskFieldTypes();

  return {
    title: baseTaskFieldsTypes.title,
    location: baseTaskFieldsTypes.location,
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
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('tasks.fixedTask.start_datetime')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('tasks.fixedTask.end_datetime')
    }
  };
};

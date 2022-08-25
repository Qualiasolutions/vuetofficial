import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

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
    },
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

  const baseTaskFieldsTypes = taskFieldTypes()

  return {
    title: baseTaskFieldsTypes.title,
    location: baseTaskFieldsTypes.location,
    members: {
      type: 'addMembers',
      required: true,
      permittedValues: userFullDetails?.family?.users || [],
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
    },
  };
};

export const flexibleTaskForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    ...taskFieldTypes(),
    due_date: {
      type: 'Date',
      required: true,
      displayName: t('tasks.flexibleTask.due_date')
    }
  };
};

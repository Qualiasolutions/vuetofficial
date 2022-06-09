import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

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
    }
  };
};

export const fixedTaskForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    ...taskFieldTypes(),
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

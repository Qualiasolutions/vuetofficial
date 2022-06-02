import { FormFieldTypes } from 'components/forms/formFieldTypes';

const taskFieldTypes: FormFieldTypes = {
  title: {
    type: 'string',
    required: true
  },
  location: {
    type: 'string',
    required: false
  }
};

export const fixedTaskForm: FormFieldTypes = {
  ...taskFieldTypes,
  start_datetime: {
    type: 'DateTime',
    required: true
  },
  end_datetime: {
    type: 'DateTime',
    required: true
  }
};

export const flexibleTaskForm: FormFieldTypes = {
  ...taskFieldTypes,
  due_date: {
    type: 'Date',
    required: true
  }
};

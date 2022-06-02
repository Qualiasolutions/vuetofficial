import { FormFieldTypes } from '../formFieldTypes';

export const completionFormFieldTypes: {
  [resourceType: string]: FormFieldTypes;
} = {
  BookMOTTask: {
    location: {
      type: 'string',
      required: true
    },
    start_datetime: {
      type: 'DateTime',
      required: true
    },
    end_datetime: {
      type: 'DateTime',
      required: true
    }
  }
};

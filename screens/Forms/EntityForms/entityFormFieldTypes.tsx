import { FormFieldTypes } from '../formFieldTypes';

export const carForm: FormFieldTypes = {
  name: {
    type: 'string',
    required: true
  },
  make: {
    type: 'string',
    required: true
  },
  model: {
    type: 'string',
    required: true
  },
  registration: {
    type: 'string',
    required: true
  },
  MOT_due_date: {
    type: 'Date',
    required: false,
    displayName: 'MOT Due'
  },
  insurance_due_date: {
    type: 'Date',
    required: false,
    displayName: 'Insurance Due'
  },
  service_due_date: {
    type: 'Date',
    required: false,
    displayName: 'Service Due'
  }
};

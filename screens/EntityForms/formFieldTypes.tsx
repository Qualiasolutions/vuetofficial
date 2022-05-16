type PermittedTypes = 'string' | 'Date';

export type FormFieldTypes = {
  [key: string]: {
    type: PermittedTypes;
    required: boolean;
    displayName?: string | undefined;
    initialValue?: PermittedTypes;
  };
};

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

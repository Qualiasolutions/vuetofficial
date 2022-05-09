export const carForm = {
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
    required: false
  },
  insurance_due_date: {
    type: 'Date',
    required: false
  },
  service_due_date: {
    type: 'Date',
    required: false
  }
};

import { useSelector } from 'react-redux';
import { selectFamily } from 'reduxStore/slices/family/selectors';
import { FormFieldTypes } from '../formFieldTypes';

export const carForm = (): FormFieldTypes => {
  const family = useSelector(selectFamily);

  return {
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
    },
    owner: {
      type: 'radio',
      required: true,
      permittedValues: family.users,
      valueToDisplay: (val: any) => val.username
    }
  }
};

import { Recurrence } from 'types/tasks';
import { FlatFormFieldTypes } from '../formFieldTypes';
import { FieldValueTypes } from '../types';

const hasAllRequired = (
  formValues: FieldValueTypes,
  fields: FlatFormFieldTypes
) => {
  const parsedFormValues = { ...formValues };
  for (const field in parsedFormValues) {
    if (!fields[field].required) {
      continue
    }

    if (['multiRecurrenceSelector'].includes(fields[field]?.type)) {
      const value = parsedFormValues[field] as Recurrence[]
      if (value && value.filter(v => v).length > 0) {
        continue
      }
      return false
    }

    if (['addMembers'].includes(fields[field]?.type)) {
      const value = parsedFormValues[field]
      if (value && value.length > 0) {
        continue
      }
      return false
    }

    if (['tagSelector'].includes(fields[field]?.type)) {
      const value = parsedFormValues[field]
      if (value && value.entities && value.entities.length > 0) {
        continue
      }
      return false
    }

    const value = parsedFormValues[field]
    if (!value) {
      return false
    }
  }

  return true;
};

export default hasAllRequired;

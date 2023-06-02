import { Field } from '../formFieldTypes';

export default function isFieldShown(
  field: Field,
  formValues: { [key: string]: any }
) {
  if (field.hidden) {
    return false;
  }
  if (field.shownFields) {
    if (field.shownFields) {
      for (const dependentField in field.shownFields) {
        if (!formValues[dependentField] === field.shownFields[dependentField]) {
          return false;
        }
      }
    }
  }

  return true;
}

import dayjs from 'dayjs';
import { FormFieldTypes } from '../formFieldTypes';
import { FieldValueTypes } from '../types';

const parseFormValues = (
  formValues: FieldValueTypes,
  fields: FormFieldTypes
) => {
  const parsedFormValues = { ...formValues };
  for (const field in parsedFormValues) {
    if (['DateTime'].includes(fields[field]?.type)) {
      if (parsedFormValues[field]) {
        parsedFormValues[field] = parsedFormValues[field].toISOString();
      } else {
        delete parsedFormValues[field];
      }
    }
    if (['Date', 'OptionalYearDate'].includes(fields[field]?.type)) {
      if (parsedFormValues[field]) {
        parsedFormValues[field] = dayjs(parsedFormValues[field]).format(
          'YYYY-MM-DD'
        );
      } else {
        delete parsedFormValues[field];
      }
    }
    if (['Image'].includes(fields[field]?.type)) {
      // Delete if the image is provided as a string
      if (
        parsedFormValues[field] &&
        typeof parsedFormValues[field] === 'string'
      ) {
        delete parsedFormValues[field];
      }
    }
  }

  return parsedFormValues;
};

export default parseFormValues;

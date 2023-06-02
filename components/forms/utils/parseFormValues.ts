import dayjs from 'dayjs';
import { Recurrence } from 'types/tasks';
import {
  FlatFormFieldTypes,
  MultiRecurrenceSelectorField
} from '../formFieldTypes';
import { FieldValueTypes } from '../types';

const parseFormValues = (
  formValues: FieldValueTypes,
  fields: FlatFormFieldTypes
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
    if (['multiRecurrenceSelector'].includes(fields[field]?.type)) {
      const f = fields[field] as MultiRecurrenceSelectorField;
      const value = parsedFormValues[field] as Recurrence[];
      if (f.reverse) {
        const lastTime = new Date(parsedFormValues[f.firstOccurrenceField]);
        parsedFormValues[field] = value
          ? value.map((recurrence) => {
              const earliest = recurrence.latest_occurrence
                ? new Date(recurrence.latest_occurrence)
                : null;
              if (earliest) {
                earliest.setHours(0);
                earliest.setMinutes(0);
                earliest.setSeconds(0);
                earliest.setMilliseconds(0);
              }

              return {
                ...recurrence,
                recurrence_type: recurrence.recurrence,
                earliest_timedelta: earliest
                  ? (lastTime.getTime() - earliest.getTime()) / 1000
                  : null
              };
            })
          : [];
      }
    }

    if (['tagSelector'].includes(fields[field]?.type)) {
      parsedFormValues.entities = parsedFormValues[field].entities;
    }
  }

  return parsedFormValues;
};

export default parseFormValues;

import { Reminder } from 'types/tasks';
import { UserFullResponse, UserResponse } from 'types/users';
import { deepCopy } from 'utils/copy';
import {
  Field,
  FormFieldTypes,
  ImageField,
  MultiRecurrenceSelectorField
} from '../formFieldTypes';

const createInitialObject = (
  fields: FormFieldTypes,
  userDetails: UserFullResponse | UserResponse,
  initialOverrides?: {
    [key: string]: any;
  }
): { [key: string]: any } => {
  if (Array.isArray(fields)) {
    throw Error('`fields` cannot be an array');
  }
  const formFields = deepCopy<{ [key: string]: Field }>(fields);
  if (initialOverrides) {
    for (const fieldName in formFields) {
      if (Object.keys(formFields[fieldName]).includes('sourceField')) {
        formFields[fieldName].initialValue =
          initialOverrides[(formFields[fieldName] as ImageField).sourceField] ||
          null;
      } else if (fieldName in initialOverrides) {
        formFields[fieldName].initialValue =
          initialOverrides[fieldName] || formFields[fieldName].initialValue;
      }
    }
  }

  const initialObj: { [key: string]: any } = {};
  for (const key of Object.keys(formFields)) {
    switch (formFields[key].type) {
      case 'string':
      case 'timezone':
      case 'colour':
      case 'phoneNumber':
      case 'radio':
      case 'TextArea':
      case 'Image':
      case 'dropDown':
      case 'dropDownWithOther':
        initialObj[key] = formFields[key].initialValue || '';
        continue;

      case 'Date':
      case 'OptionalYearDate':
        if (formFields[key].initialValue) {
          const parsedDate = new Date(formFields[key].initialValue || '');
          // Date fields should be the same in all timezones
          const timezoneIgnorantDate = new Date(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate()
          );

          initialObj[key] = timezoneIgnorantDate;
        } else {
          initialObj[key] = null;
        }
        continue;

      case 'DateTime':
        initialObj[key] = formFields[key].initialValue
          ? new Date(formFields[key].initialValue || '')
          : null;
        continue;

      case 'addMembers':
      case 'addFamilyMembers':
        initialObj[key] =
          formFields[key].initialValue ||
          (userDetails ? [userDetails?.id] : []);
        continue;

      case 'tagSelector':
        initialObj[key] = formFields[key].initialValue || {
          entities: [],
          tags: []
        };
        continue;

      case 'checkbox':
        initialObj[key] = formFields[key].initialValue || false;
        continue;

      case 'multiRecurrenceSelector':
        const f = formFields[key] as MultiRecurrenceSelectorField;

        if (f.initialValue) {
          if (f.reverse) {
            const taskStartTime = new Date(
              formFields[f.firstOccurrenceField].initialValue
            );
            const timeDelta = f.initialValue.earliest_timedelta;

            let latestOccurrence: null | Date = null;
            if (timeDelta) {
              latestOccurrence = new Date(taskStartTime);
              const [days, time] = timeDelta.split(' ');
              latestOccurrence.setDate(latestOccurrence.getDate() - days);
            }

            const initialValue = f.initialValue.map((rec: Reminder) => ({
              ...rec,
              recurrence: rec.recurrence_type,
              latest_occurrence: latestOccurrence
            }));

            initialObj[key] = initialValue;
          }
        }
        continue;

      default:
        initialObj[key] = formFields[key].initialValue || null;
    }
  }

  return initialObj;
};

export default createInitialObject;

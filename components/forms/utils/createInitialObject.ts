import dayjs from 'dayjs';
import { Recurrence, Reminder } from 'types/tasks';
import { UserFullResponse, UserResponse } from 'types/users';
import { deepCopy } from 'utils/copy';
import {
  DateTimeField,
  Field,
  FormFieldTypes,
  MultiRecurrenceSelectorField
} from '../formFieldTypes';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
        const sourceField = formFields[fieldName].sourceField || fieldName;
        formFields[fieldName].initialValue =
          initialOverrides[sourceField] || null;
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

      case 'DateTime': {
        const f = formFields[key] as DateTimeField;
        if (f.utc) {
          if (formFields[key].initialValue) {
            const dateObj = new Date(formFields[key].initialValue);
            const tzDifference = dateObj.getTimezoneOffset();
            initialObj[key] = new Date(
              dateObj.getTime() + tzDifference * 60 * 1000
            );
          } else {
            initialObj[key] = null;
          }
        } else {
          if (formFields[key].initialValue) {
            initialObj[key] = new Date(formFields[key].initialValue || '');
          } else {
            initialObj[key] = null;
          }
        }
        continue;
      }

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

            const initialValue = f.initialValue.map((rec: Recurrence) => ({
              ...rec,
              recurrence: rec.recurrence,
              latest_occurrence: latestOccurrence
            }));

            initialObj[key] = initialValue;
          }
        }
        continue;

      case 'actionsSelector':
      case 'reminderSelector':
        initialObj[key] = formFields[key].initialValue || [];
        continue;

      default:
        initialObj[key] = formFields[key].initialValue || null;
    }
  }

  return initialObj;
};

export default createInitialObject;

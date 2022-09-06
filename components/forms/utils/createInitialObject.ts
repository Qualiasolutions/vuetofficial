import { UserFullResponse, UserResponse } from 'types/users';
import { deepCopy } from 'utils/copy';
import { FormFieldTypes, ImageField } from '../formFieldTypes';

const createInitialObject = (
  fields: FormFieldTypes,
  userDetails: UserFullResponse | UserResponse,
  initialOverrides?: {
    [key: string]: any;
  }
): { [key: string]: any } => {
  const formFields = deepCopy<FormFieldTypes>(fields);
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

      default:
        initialObj[key] = null;
    }
  }

  return initialObj;
};

export default createInitialObject;

import getUserFullDetails from "hooks/useGetUserDetails";
import { FormFieldTypes } from "../formFieldTypes";

const createInitialObject = (
  fields: FormFieldTypes
): { [key: string]: any } => {
  const { data: userDetails } = getUserFullDetails()

  const initialObj: { [key: string]: any } = {};
  for (const key of Object.keys(fields)) {
    switch (fields[key].type) {
      case 'string':
      case 'colour':
      case 'phoneNumber':
      case 'radio':
      case 'TextArea':
      case 'Image':
      case 'dropDownWithOther':
        initialObj[key] = fields[key].initialValue || '';
        continue;

      case 'Date':
      case 'OptionalYearDate':
        if (fields[key].initialValue) {
          const parsedDate = new Date(fields[key].initialValue || '');
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
        initialObj[key] = fields[key].initialValue
          ? new Date(fields[key].initialValue || '')
          : null;
        continue;

      case 'addMembers':
      case 'addFamilyMembers':
        initialObj[key] = fields[key].initialValue || (userDetails ? [userDetails?.id] : []);
        continue;

      default:
        initialObj[key] = null;
    }
  }
  return initialObj;
};

export default createInitialObject
import {
  ColourField,
  DateField,
  FormFieldTypes,
  PhoneNumberField,
  StringField
} from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

export type FamilyMemberFormFieldTypes = {
  first_name: StringField;
  last_name: StringField;
  dob: DateField;
  member_colour: ColourField;
  phone_number: PhoneNumberField;
};

export const familyMemberForm = (): FamilyMemberFormFieldTypes => {
  const { t } = useTranslation('modelFields');

  return {
    first_name: {
      type: 'string',
      required: true,
      displayName: t('familyMember.first_name')
    },
    last_name: {
      type: 'string',
      required: true,
      displayName: t('familyMember.last_name')
    },
    dob: {
      type: 'Date',
      required: true,
      displayName: t('familyMember.dob')
    },
    member_colour: {
      type: 'colour',
      required: true,
      displayName: t('familyMember.member_colour')
    },
    phone_number: {
      type: 'phoneNumber',
      required: true,
      displayName: t('familyMember.phone_number')
    }
  };
};

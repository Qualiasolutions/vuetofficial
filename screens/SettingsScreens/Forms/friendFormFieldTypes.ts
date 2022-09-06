import { PhoneNumberField, StringField } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';

export type FriendFormFieldTypes = {
  first_name: StringField;
  last_name: StringField;
  phone_number: PhoneNumberField;
};

export const friendForm = (): FriendFormFieldTypes => {
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
    phone_number: {
      type: 'phoneNumber',
      required: true,
      displayName: t('familyMember.phone_number')
    }
  };
};

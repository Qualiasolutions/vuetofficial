import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const schoolForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

  const { t } = useTranslation('modelFields');

  if (isLoadingFullDetails || fullDetailsError || !userFullDetails) {
    return {};
  }

  return {
    image: {
      type: 'Image',
      required: false,
      displayName: t('entities.entity.image'),
      sourceField: 'presigned_image_url'
    },
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    address: {
      type: 'TextArea',
      required: false,
      displayName: t('entities.school.address')
    },
    phone_number: {
      type: 'phoneNumber',
      required: false,
      displayName: t('entities.school.phone_number')
    },
    email: {
      type: 'string',
      required: false,
      displayName: t('entities.school.email')
    },
    notes: {
      type: 'TextArea',
      required: false,
      displayName: t('entities.entity.notes')
    },
    members: {
      type: 'addFamilyMembers',
      required: true,
      permittedValues: userFullDetails.family.users,
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.career-goal.members')
    }
  };
};

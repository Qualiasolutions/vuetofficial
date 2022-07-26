import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const eventForm = (): FormFieldTypes => {
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
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    date: {
      type: 'Date',
      required: true,
      displayName: t('entities.event.date')
    },
    owner: {
      type: 'radio',
      required: true,
      permittedValues: userFullDetails.family.users,
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.entity.owner')
    }
  };
};

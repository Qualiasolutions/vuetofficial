import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const daysOffForm = (): FormFieldTypes => {
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
    start_datetime: {
      type: 'Date',
      required: true,
      displayName: t('entities.trip-activity.start_datetime')
    },
    end_datetime: {
      type: 'Date',
      required: true,
      displayName: t('entities.trip-activity.end_datetime')
    }
  };
};

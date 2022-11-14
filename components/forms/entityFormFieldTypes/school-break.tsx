import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const schoolBreakForm = (): FormFieldTypes => {
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
      displayName: t('entities.school-break.name')
    },
    start_date: {
      type: 'Date',
      required: true,
      displayName: t('entities.school-break.start_date'),
      associatedEndDateField: 'end_date'
    },
    end_date: {
      type: 'Date',
      required: true,
      displayName: t('entities.school-break.end_date'),
      associatedStartDateField: 'start_date'
    }
  };
};

import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';

export const useAnniversaryForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

  const { t } = useTranslation('modelFields');

  return useMemo(() => {
    return {
      name: {
        type: 'string',
        required: true,
        displayName: t('entities.entity.name')
      },
      start_date: {
        type: 'OptionalYearDate',
        required: true,
        displayName: t('entities.anniversary.start_date'),
        knownYearField: 'known_year'
      },
      members: {
        type: 'addFamilyMembers',
        required: true,
        permittedValues: userFullDetails?.family?.users || [],
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('entities.anniversary.members')
      }
    };
  }, [t, userFullDetails]);
};

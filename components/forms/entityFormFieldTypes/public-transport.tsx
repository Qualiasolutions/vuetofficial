import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';

export const usePublicTransportForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = getUserFullDetails();

  const { t } = useTranslation('modelFields');

  return useMemo(() => {
    return {
      name: {
        type: 'string',
        required: true,
        displayName: t('entities.entity.name')
      },
      members: {
        type: 'addMembers',
        required: true,
        permittedValues: {
          family: userFullDetails?.family?.users || [],
          friends: userFullDetails?.friends || []
        },
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('entities.entity.members')
      }
    };
  }, [t, userFullDetails]);
};

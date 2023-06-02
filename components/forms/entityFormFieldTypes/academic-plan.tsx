import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';

export const useAcademicPlanForm = (): FormFieldTypes => {
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
      members: {
        type: 'addMembers',
        required: true,
        permittedValues: {
          family: userFullDetails?.family?.users || [],
          friends: userFullDetails?.friends || []
        },
        valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
        displayName: t('entities.academic-plan.members')
      }
    };
  }, [t, userFullDetails]);
};

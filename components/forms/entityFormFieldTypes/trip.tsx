import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';

export const useTripForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = getUserFullDetails();

  const { t } = useTranslation('modelFields');

  return useMemo(() => {
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
      start_date: {
        type: 'Date',
        required: true,
        displayName: t('entities.trip.start_date'),
        associatedEndDateField: 'end_date'
      },
      end_date: {
        type: 'Date',
        required: true,
        displayName: t('entities.trip.end_date'),
        associatedStartDateField: 'start_date'
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

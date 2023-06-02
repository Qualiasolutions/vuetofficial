import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';

export const useSocialMediaForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

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
      notes: {
        type: 'TextArea',
        required: false,
        displayName: t('entities.entity.description')
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

import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const homeForm = (): FormFieldTypes => {
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();
  const { t } = useTranslation('modelFields');

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
      type: 'string',
      required: true,
      displayName: t('entities.home.address')
    },
    residence_type: {
      type: 'dropDown',
      required: true,
      displayName: t('entities.home.residence_type'),
      permittedValues: [
        { label: 'Residence', value: 'RESIDENCE' },
        { label: 'Second Home', value: 'SECOND_HOME' },
        { label: 'Investment', value: 'INVESTMENT' }
      ],
      listMode: 'MODAL'
    },
    house_type: {
      type: 'dropDown',
      required: true,
      displayName: t('entities.home.house_type'),
      permittedValues: [
        { label: 'House', value: 'HOUSE' },
        { label: 'Apartment', value: 'APARTMENT' }
      ],
      listMode: 'MODAL'
    },
    has_outside_area: {
      type: 'dropDown',
      required: true,
      displayName: t('entities.home.has_outside_area'),
      permittedValues: [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ],
      listMode: 'MODAL'
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
};

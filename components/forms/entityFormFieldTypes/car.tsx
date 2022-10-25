import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useTranslation } from 'react-i18next';
import useGetUserDetails from 'hooks/useGetUserDetails';

export const carForm = (): FormFieldTypes => {
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
    make: {
      type: 'string',
      required: true,
      displayName: t('entities.car.make')
    },
    model: {
      type: 'string',
      required: true,
      displayName: t('entities.car.model')
    },
    registration: {
      type: 'string',
      required: false,
      displayName: t('entities.car.registration'),
      transform: 'uppercase'
    },
    date_registered: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.date_registered')
    },
    MOT_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.MOT_due_date')
    },
    tax_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.tax_due_date')
    },
    service_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.service_due_date')
    },
    insurance_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.insurance_due_date')
    },
    warranty_due_date: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.warranty_due_date')
    },
    vehicle_type: {
      type: 'dropDown',
      permittedValues: [
        {
          label: 'Car',
          value: 'CAR'
        },
        {
          label: 'Motorbike',
          value: 'MOTORBIKE'
        }
      ],
      required: false,
      displayName: t('entities.car.vehicle_type'),
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

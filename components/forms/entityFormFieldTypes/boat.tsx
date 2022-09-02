import { FormFieldTypes } from 'components/forms/formFieldTypes';
import {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery
} from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

export const boatForm = (): FormFieldTypes => {
  const username = useSelector(selectUsername);
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userDetailsError
  } = useGetUserDetailsQuery(username);

  const { t } = useTranslation('modelFields');

  if (isLoadingUserDetails || userDetailsError || !userDetails) {
    return {};
  }

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails.user_id);

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
      required: true,
      displayName: t('entities.car.registration')
    },
    date_registered: {
      type: 'Date',
      required: false,
      displayName: t('entities.car.date_registered')
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
    vehicle_type: {
      type: 'dropDown',
      permittedValues: [
        {
          label: 'Boat',
          value: 'BOAT'
        },
        {
          label: 'Other',
          value: 'OTHER'
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
        friends: userFullDetails?.friends || [],
      },
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.entity.members')
    }
  };
};

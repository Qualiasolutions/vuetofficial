import { FormFieldTypes } from 'components/forms/formFieldTypes';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useTranslation } from 'react-i18next';

export const rentalCarForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = getUserFullDetails();

  return {
    carrier: {
      type: 'string',
      required: true,
      displayName: t('entities.mode-of-transport.carrier')
    },
    booking_number: {
      type: 'string',
      required: true,
      displayName: t('entities.rental-car.booking_number')
    },
    start_location: {
      type: 'string',
      required: true,
      displayName: t('entities.rental-car.start_location')
    },
    end_location: {
      type: 'string',
      required: true,
      displayName: t('entities.rental-car.end_location')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.mode-of-transport.start_datetime')
    },
    start_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.mode-of-transport.start_timezone')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.mode-of-transport.end_datetime')
    },
    end_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.mode-of-transport.end_timezone')
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

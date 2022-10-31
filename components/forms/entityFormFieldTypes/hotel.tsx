import { FormFieldTypes } from 'components/forms/formFieldTypes';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useTranslation } from 'react-i18next';

export const hotelForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = getUserFullDetails();

  return {
    hotel_name: {
      type: 'string',
      required: true,
      displayName: t('entities.hotel.hotel_name')
    },
    address: {
      type: 'string',
      required: false,
      displayName: t('entities.mode-of-accommodation.address')
    },
    contact_details: {
      type: 'string',
      required: false,
      displayName: t('entities.mode-of-accommodation.contact_details')
    },
    start_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.hotel.start_datetime')
    },
    start_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.hotel.start_timezone')
    },
    end_datetime: {
      type: 'DateTime',
      required: true,
      displayName: t('entities.hotel.end_datetime')
    },
    end_timezone: {
      type: 'timezone',
      required: true,
      displayName: t('entities.hotel.end_timezone')
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

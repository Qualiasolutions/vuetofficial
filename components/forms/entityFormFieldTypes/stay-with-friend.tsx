import { FormFieldTypes } from 'components/forms/formFieldTypes';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useStayWithFriendForm = (): FormFieldTypes => {
  const { t } = useTranslation('modelFields');
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = getUserFullDetails();

  return useMemo(() => {
    return {
      friend_name: {
        type: 'string',
        required: true,
        displayName: t('entities.stay-with-friend.friend_name')
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
        displayName: t('entities.stay-with-friend.start_datetime')
      },
      start_timezone: {
        type: 'timezone',
        required: true,
        displayName: t('entities.stay-with-friend.start_timezone')
      },
      end_datetime: {
        type: 'DateTime',
        required: true,
        displayName: t('entities.stay-with-friend.end_datetime')
      },
      end_timezone: {
        type: 'timezone',
        required: true,
        displayName: t('entities.stay-with-friend.end_timezone')
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

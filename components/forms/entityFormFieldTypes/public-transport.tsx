import { FormFieldTypes } from 'components/forms/formFieldTypes';
import {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery
} from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

export const publicTransportForm = (): FormFieldTypes => {
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
    name: {
      type: 'string',
      required: true,
      displayName: t('entities.entity.name')
    },
    members: {
      type: 'addMembers',
      required: true,
      permittedValues: userFullDetails?.family?.users || [],
      valueToDisplay: (val: any) => `${val.first_name} ${val.last_name}`,
      displayName: t('entities.entity.members')
    }
  };
};

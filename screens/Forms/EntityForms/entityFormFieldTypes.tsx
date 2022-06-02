import { FormFieldTypes } from 'components/forms/formFieldTypes';
import { useGetUserFullDetailsQuery, useGetUserDetailsQuery } from 'reduxStore/services/api/api';

export const carForm = (): FormFieldTypes => {

  const { data: userDetails, isLoading: isLoadingUserDetails, error: userDetailsError } = useGetUserDetailsQuery()

  if (isLoadingUserDetails || userDetailsError || !userDetails) {
    return {}
  }

  const { data: userFullDetails, isLoading: isLoadingFullDetails, error: fullDetailsError } = useGetUserFullDetailsQuery(userDetails.user_id)

  if (isLoadingFullDetails || fullDetailsError || !userFullDetails) {
    return {}
  }

  return {
    name: {
      type: 'string',
      required: true
    },
    make: {
      type: 'string',
      required: true
    },
    model: {
      type: 'string',
      required: true
    },
    registration: {
      type: 'string',
      required: true
    },
    MOT_due_date: {
      type: 'Date',
      required: false,
      displayName: 'MOT Due'
    },
    insurance_due_date: {
      type: 'Date',
      required: false,
      displayName: 'Insurance Due'
    },
    service_due_date: {
      type: 'Date',
      required: false,
      displayName: 'Service Due'
    },
    owner: {
      type: 'radio',
      required: true,
      permittedValues: userFullDetails.family.users,
      valueToDisplay: (val: any) => val.username
    }
  };
};

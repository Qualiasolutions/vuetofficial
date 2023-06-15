import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';

export default function useGetUserFullDetails() {
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userDetailsError
  } = useGetUserDetailsQuery();

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  return {
    data: userFullDetails,
    isLoading: isLoadingUserDetails || isLoadingFullDetails,
    error: userDetailsError || fullDetailsError
  };
}

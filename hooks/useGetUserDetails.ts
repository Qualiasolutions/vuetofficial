import { useSelector } from 'react-redux';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';

export default function useGetUserFullDetails() {
  const jwtAccessToken = useSelector(selectAccessToken);

  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userDetailsError
  } = useGetUserDetailsQuery(null as any, {
    skip: !jwtAccessToken
  });

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id,
    pollingInterval: 30000
  });

  return {
    data: userFullDetails,
    isLoading: isLoadingUserDetails || isLoadingFullDetails,
    error: userDetailsError || fullDetailsError
  };
}

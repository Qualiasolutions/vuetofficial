import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import {
  setLoadingUserDetails,
  setUserFullDetails
} from 'reduxStore/slices/users/actions';
import {
  selectLoadingReduxUserDetails,
  selectReduxUserDetails
} from 'reduxStore/slices/users/selectors';

export default function useSyncUserDetails() {
  const dispatch = useDispatch();
  const { data: userDetails } = useGetUserDetailsQuery();
  const userId = userDetails ? userDetails.user_id : -1;
  const { data, isLoadingUserDetails } = useGetUserFullDetailsQuery(userId, {
    skip: userId === -1,
    pollingInterval: 10000,
    selectFromResult: ({ data: userData, isLoading }) => ({
      data: userData,
      isLoadingUserDetails: isLoading
    })
  });

  const currentUserDetails = useSelector(selectReduxUserDetails);
  const currentLoading = useSelector(selectLoadingReduxUserDetails);

  useEffect(() => {
    if (currentLoading !== isLoadingUserDetails) {
      dispatch(setLoadingUserDetails(isLoadingUserDetails));
    }

    if (!data && currentUserDetails && !isLoadingUserDetails) {
      dispatch(setUserFullDetails(null));
    }

    if (data && JSON.stringify(currentUserDetails) !== JSON.stringify(data)) {
      dispatch(setUserFullDetails(data));
    }
  }, [
    currentLoading,
    currentUserDetails,
    dispatch,
    data,
    isLoadingUserDetails
  ]);
}

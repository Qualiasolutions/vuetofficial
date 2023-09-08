import { useSelector } from 'react-redux';
import userApi from 'reduxStore/services/api/user';

export default function useGetUserFullDetails() {
  const userDetails = useSelector(
    userApi.endpoints.getUserDetails.select()
  ).data;

  const userId = userDetails ? userDetails.user_id : -1;
  const userFullDetails = useSelector(
    userApi.endpoints.getUserFullDetails.select(userId)
  );

  return {
    data: userFullDetails.data
  };
}

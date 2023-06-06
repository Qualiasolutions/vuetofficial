import { createSelector } from '@reduxjs/toolkit';
import userApi from 'reduxStore/services/api/user';

export const selectCurrentUserId = createSelector(
  userApi.endpoints.getUserDetails.select(),
  (user) => user.data?.user_id
);

export const selectUserFromId = (userId: number) =>
  createSelector(
    userApi.endpoints.getUserFullDetails.select(userId),
    (user) => {
      return user.data;
    }
  );

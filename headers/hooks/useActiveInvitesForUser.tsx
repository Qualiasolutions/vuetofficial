import getUserFullDetails from "hooks/useGetUserDetails";
import { useSelector } from "react-redux";
import { useGetUserInvitesQuery } from "reduxStore/services/api/user";
import { selectAccessToken } from "reduxStore/slices/auth/selectors";

export default function useActiveInvitesForUser() {
  const jwtAccessToken = useSelector(selectAccessToken);
  const { data: userFullDetails, isLoading: isLoadingUserFullDetails } = getUserFullDetails()

  const { data: userInvites, isLoading: isLoadingUserInvites } =
    useGetUserInvitesQuery(userFullDetails?.family?.id || -1, {
      skip: (!jwtAccessToken || !userFullDetails?.family?.id)
    });

  if (!jwtAccessToken) {
    return {
      data: [],
      isLoading: false
    }
  }

  const isLoading =
    isLoadingUserFullDetails || isLoadingUserInvites || !userInvites;

  if (isLoading) {
    return {
      data: [],
      isLoading: true
    }
  }

  const invitesForUser = userInvites.filter(
    (invite) =>
      // Only want invites for user
      invite.phone_number === userFullDetails?.phone_number &&
      // Don't want rejected invites
      !invite.rejected &&
      // Don't want invites for own family
      userFullDetails?.family?.id !== invite.family &&
      (
        // Don't want friend invites for already-added friends
        !(
          !invite.family &&
          userFullDetails?.friends
            ?.map((user) => user.id)
            .includes(invite.invitee.id)
        )
      )
  );

  return {
    isLoading: false,
    data: invitesForUser
  }
} 
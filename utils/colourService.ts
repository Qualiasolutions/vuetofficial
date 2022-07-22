import { UserFullResponse } from 'types/users';

export const colourService = {
  getMemberColourByIdFromUserDetails(id: number, user: UserFullResponse) {
    if (id === user.id) {
      return user.member_colour;
    } else {
      const colour = user.family.users.find((x) => x.id === id)?.member_colour;
      return colour || '';
    }
  }
};

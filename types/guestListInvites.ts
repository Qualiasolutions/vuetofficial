export type GuestListInvite = {
  user: number;
  entity: number;
  phone_number: string;
  email: string;
  accepted: boolean;
  rejected: boolean;
  maybe: boolean;
  id: number;
};

export type CreateGuestListInviteRequest = Partial<GuestListInvite> & {
  entity: number;
};

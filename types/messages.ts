export type CreateMessageRequest = {
  text: string;
  user: number;
  task: number | null;
  entity: number | null;
};

export type MessageResponse = CreateMessageRequest & {
  id: number;
  created_at: string;
};

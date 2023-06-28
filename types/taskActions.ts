export type TaskAction = {
  id: number;
  task: number;
  is_complete: boolean;
  action_timedelta: string;
};

export type AllTaskActions = {
  ids: number[];
  byId: {
    [key: number]: TaskAction;
  };
};

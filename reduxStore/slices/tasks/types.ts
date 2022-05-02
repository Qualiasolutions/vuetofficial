import { TaskResponseType } from 'types/tasks';

type AllTasks = {
  ids: number[];
  byId: {
    [id: number]: TaskResponseType;
  };
};

type TasksState = {
  allTasks: AllTasks;
};

export { AllTasks, TasksState };

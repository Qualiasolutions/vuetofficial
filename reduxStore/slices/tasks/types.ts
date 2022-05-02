import allActionNames from './actionNames';
import { TaskParsedType } from 'types/tasks';

type TasksState = {
  allTasks: TaskParsedType[];
};

type SetAllTasksReducerActionType = {
  type: keyof typeof allActionNames;
  value: TaskParsedType[];
};

type SetTaskCompletionReducerActionType = {
  type: keyof typeof allActionNames;
  value: boolean;
  taskId: number;
};

export {
  TasksState,
  SetAllTasksReducerActionType,
  SetTaskCompletionReducerActionType
};

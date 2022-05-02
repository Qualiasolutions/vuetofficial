import allActionNames from './actionNames';
import { TaskParsedType } from 'types/tasks'

type TasksState = {
  allTasks: TaskParsedType[];
};

type TasksReducerActionType = {
  type: keyof typeof allActionNames;
  value: TaskParsedType[];
};

export { TasksState, TasksReducerActionType };

import {
  SET_ALL_TASKS,
  SET_TASK_BY_ID,
  SET_TASK_COMPLETION
} from './actionNames';

import { TaskResponseType } from 'types/tasks';

import { createAction } from 'typesafe-actions';

const setAllTasks = createAction(SET_ALL_TASKS)<TaskResponseType[]>();
const setTaskCompletion = createAction(SET_TASK_COMPLETION)<{
  taskId: number;
  value: boolean;
}>();

const setTaskById = createAction(SET_TASK_BY_ID)<{
  taskId: number;
  value: TaskResponseType;
}>();

export { setAllTasks, setTaskCompletion, setTaskById };

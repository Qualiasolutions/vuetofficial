import {
  SET_ALL_TASKS
} from './actionNames';

import { TasksReducerActionType } from './types';
import { TaskParsedType } from 'types/tasks';

function setAllTasks(value: TaskParsedType[]): TasksReducerActionType {
  return {
    type: SET_ALL_TASKS,
    value
  };
}

export { setAllTasks };

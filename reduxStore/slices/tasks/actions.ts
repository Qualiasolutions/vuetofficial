import { SET_ALL_TASKS, SET_TASK_COMPLETION } from './actionNames';

import {
  SetAllTasksReducerActionType,
  SetTaskCompletionReducerActionType
} from './types';
import { TaskParsedType } from 'types/tasks';

function setAllTasks(value: TaskParsedType[]): SetAllTasksReducerActionType {
  return {
    type: SET_ALL_TASKS,
    value
  };
}

function setTaskComplete(
  id: number,
  value: boolean
): SetTaskCompletionReducerActionType {
  return {
    type: SET_TASK_COMPLETION,
    taskId: id,
    value
  };
}

export { setAllTasks, setTaskComplete };

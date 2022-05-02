import allActionNames from './actionNames';
import { TasksState, TasksReducerActionType } from './types';

const { SET_ALL_TASKS } = allActionNames;

const INITIAL_TASKS_STATE: TasksState = {
  allTasks: []
};

const tasksReducer = (
  state = INITIAL_TASKS_STATE,
  action: TasksReducerActionType
) => {
  switch (action.type) {
    case SET_ALL_TASKS:
      return { ...state, allTasks: action.value };
    default:
      return state;
  }
};

export { tasksReducer }
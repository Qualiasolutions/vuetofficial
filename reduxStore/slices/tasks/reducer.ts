import allActionNames from './actionNames';
import { TasksState, SetAllTasksReducerActionType } from './types';

const { SET_ALL_TASKS, SET_TASK_COMPLETION } = allActionNames;

const INITIAL_TASKS_STATE: TasksState = {
  allTasks: []
};

const tasksReducer = (
  state = INITIAL_TASKS_STATE,
  action: SetAllTasksReducerActionType
) => {
  switch (action.type) {
    case SET_ALL_TASKS:
      return { ...state, allTasks: action.value };
    case SET_TASK_COMPLETION:
      // TODO
      // const taskToUpdate = state.allTasks.find(task => task.id === action.taskId)
      return state;
    default:
      return state;
  }
};

export { tasksReducer };

import { TasksState } from './types';
import * as actions from './actions';

import { ActionType, createReducer } from 'typesafe-actions';

export type TasksAction = ActionType<typeof actions>;

const INITIAL_TASKS_STATE: TasksState = {
  allTasks: {
    ids: [],
    byId: {}
  }
};

const tasksReducer = createReducer(INITIAL_TASKS_STATE)
  .handleAction(actions.setAllTasks, (state, { payload }) => ({
    ...state,
    allTasks: {
      ids: payload.map(({ id }) => id),
      byId: payload.reduce(
        (prev, next) => ({
          ...prev,
          [next.id]: next
        }),
        {}
      )
    }
  }))
  .handleAction(actions.setTaskCompletion, (state, { payload }) => ({
    ...state,
    allTasks: {
      ids: state.allTasks.ids,
      byId: {
        ...state.allTasks.byId,
        [payload.taskId]: {
          ...state.allTasks.byId[payload.taskId],
          is_complete: payload.value
        }
      }
    }
  }))
  .handleAction(actions.setTaskById, (state, { payload }) => ({
    ...state,
    allTasks: {
      ids: state.allTasks.ids,
      byId: {
        ...state.allTasks.byId,
        [payload.taskId]: payload.value
      }
    }
  }));

export { tasksReducer };

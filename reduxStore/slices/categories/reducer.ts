import { CategoriesState } from './types';
import * as actions from './actions';

import { ActionType, createReducer } from 'typesafe-actions';

export type CategoriesAction = ActionType<typeof actions>;

const INITIAL_TASKS_STATE: CategoriesState = {
  allCategories: {
    ids: [],
    byId: {}
  }
};

const categoriesReducer = createReducer(INITIAL_TASKS_STATE).handleAction(
  actions.setAllCategories,
  (state, { payload }) => ({
    ...state,
    allCategories: {
      ids: payload.map(({ id }) => id),
      byId: payload.reduce(
        (prev, next) => ({
          ...prev,
          [next.id]: next
        }),
        {}
      )
    }
  })
);

export { categoriesReducer };

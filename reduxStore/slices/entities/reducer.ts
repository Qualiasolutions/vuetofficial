import { EntitiesState } from './types';
import * as actions from './actions';

import { ActionType, createReducer } from 'typesafe-actions';

export type EntitiesAction = ActionType<typeof actions>;

const INITIAL_ENTITIES_STATE: EntitiesState = {
  allEntities: {
    ids: [],
    byId: {}
  }
};

const entitiesReducer = createReducer(INITIAL_ENTITIES_STATE).handleAction(
  actions.setAllEntities,
  (state, { payload }) => ({
    ...state,
    allEntities: {
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

export { entitiesReducer };

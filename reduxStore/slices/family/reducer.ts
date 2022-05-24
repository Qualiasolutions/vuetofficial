import { FamilyState } from './types';
import * as actions from './actions';

import { ActionType, createReducer } from 'typesafe-actions';

export type FamilyAction = ActionType<typeof actions>;

const INITIAL_FAMILY_STATE: FamilyState = {
  family: {
    id: null,
    users: []
  }
};

const familyReducer = createReducer(INITIAL_FAMILY_STATE).handleAction(
  actions.setFamily,
  (state, { payload }) => ({
    family: payload[0]
  })
);

export { familyReducer };

import { combineReducers } from 'redux';
import { authReducer } from './slices/auth/reducer';
import { vuetApi } from './services/api/api';
import { logOut } from './slices/auth/actions';
import { Action, getType } from 'typesafe-actions';
import { EntireState } from './types';

const appReducer = combineReducers({
  authentication: authReducer,
  [vuetApi.reducerPath]: vuetApi.reducer
});

const rootReducer = (state: EntireState, action: Action) => {
  if (action.type === getType(logOut)) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

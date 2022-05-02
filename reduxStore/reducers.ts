import { combineReducers } from 'redux';
import { authReducer } from './slices/auth/reducer';
import { tasksReducer } from './slices/tasks/reducer';

const rootReducer = combineReducers({
  authentication: authReducer,
  tasks: tasksReducer
});

export default rootReducer;

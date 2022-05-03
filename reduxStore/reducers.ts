import { combineReducers } from 'redux';
import { authReducer } from './slices/auth/reducer';
import { tasksReducer } from './slices/tasks/reducer';
import { categoriesReducer } from './slices/categories/reducer';

const rootReducer = combineReducers({
  authentication: authReducer,
  tasks: tasksReducer,
  categories: categoriesReducer
});

export default rootReducer;

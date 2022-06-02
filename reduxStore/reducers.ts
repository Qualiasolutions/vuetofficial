import { combineReducers } from 'redux';
import { authReducer } from './slices/auth/reducer';
import { tasksReducer } from './slices/tasks/reducer';
import { categoriesReducer } from './slices/categories/reducer';
import { entitiesReducer } from './slices/entities/reducer';
import { familyReducer } from './slices/family/reducer';
import { vuetApi } from './services/api/api';

const rootReducer = combineReducers({
  authentication: authReducer,
  tasks: tasksReducer,
  categories: categoriesReducer,
  entities: entitiesReducer,
  family: familyReducer,
  [vuetApi.reducerPath]: vuetApi.reducer
});

export default rootReducer;

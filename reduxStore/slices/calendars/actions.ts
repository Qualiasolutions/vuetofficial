import { createAction } from 'typesafe-actions';

export const setEnforcedDate = createAction('@calendars/setEnforcedDate')<{
  date: string;
}>();

export const setLastUpdateId = createAction(
  '@calendars/setLastUpdateId'
)<Date>();

export const setFilteredUsers = createAction('@calendars/setFilteredUsers')<{
  users: number[];
}>();

export const setFilteredEntities = createAction(
  '@calendars/setFilteredEntities'
)<{
  entities: number[];
}>();

export const setFilteredTags = createAction('@calendars/setFilteredTags')<{
  tags: string[];
}>();

export const setFilteredCategories = createAction(
  '@calendars/setFilteredCategories'
)<{
  categories: number[];
}>();

export const setTaskToAction = createAction('@calendars/setTaskToAction')<{
  taskId: number;
  recurrenceIndex: number | null;
  actionId: number | null;
} | null>();

export const deselectTasks = createAction('@calendars/deselectTasks')();

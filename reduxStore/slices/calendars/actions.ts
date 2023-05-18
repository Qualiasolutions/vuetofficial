import { createAction } from 'typesafe-actions';

export const setListEnforcedDate = createAction(
  '@calendars/setListEnforcedDate'
)<{ date: string }>();

export const setMonthEnforcedDate = createAction(
  '@calendars/setMonthEnforcedDate'
)<{ date: string }>();

export const deselectTasks = createAction('@calendars/deselectTasks')();

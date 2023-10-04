import { createSelector } from '@reduxjs/toolkit';
import tasksApi from 'reduxStore/services/api/tasks';
import { EntireState } from 'reduxStore/types';
import { CalendarState } from './types';

export const selectCalendarState = (
  state: EntireState
): CalendarState | undefined => state?.calendar;

export const selectEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.enforcedDate
);

export const selectLastUpdateId = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.lastUpdateId
);

export const selectFilteredUsers = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.filteredUsers
);

export const selectFilteredEntities = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.filteredEntities
);

export const selectFilteredTags = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.filteredTags
);

export const selectFilteredCategories = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.filteredCategories
);

export const selectTaskToAction = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.taskToAction
);

export const selectScheduledTaskIdsByDate = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(),
  (scheduledTasks) => {
    return scheduledTasks.data?.byDate;
  }
);

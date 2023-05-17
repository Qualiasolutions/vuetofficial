import { createSelector } from '@reduxjs/toolkit';
import { EntireState } from 'reduxStore/types';
import { CalendarState } from './types';

export const selectCalendarState = (
  state: EntireState
): CalendarState | undefined => state?.calendar;

export const selectSelectedTaskId = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.selectedTaskId || 0
);

export const selectSelectedPeriodId = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.selectedPeriodId || 0
);

export const selectSelectedReminderId = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.selectedReminderId || 0
);

export const selectSelectedRecurrenceIndex = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) =>
    calendar?.ui?.selectedRecurrenceIndex || 0
);

export const selectListEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) =>
    calendar?.ui?.listEnforcedDate
);

export const selectMonthEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) =>
    calendar?.ui?.monthEnforcedDate
);

export const selectEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) =>
    calendar?.ui?.enforcedDate
);


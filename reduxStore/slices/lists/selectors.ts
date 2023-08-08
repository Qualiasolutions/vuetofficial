import { createSelector } from '@reduxjs/toolkit';
import { EntireState } from 'reduxStore/types';
import { ListsState } from './types';

export const selectCalendarState = (
  state: EntireState
): ListsState | undefined => state?.lists;

export const selectListItemToAction = createSelector(
  selectCalendarState,
  (lists: ListsState | undefined) => lists?.data?.listItemToAction
);

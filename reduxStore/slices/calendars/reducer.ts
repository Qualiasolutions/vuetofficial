import { CalendarState } from './types';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

export type CalendarAction = ActionType<typeof actions>;

const INITIAL_CALENDAR_STATE: CalendarState = {
  data: {},
  ui: {
    selectedPeriodId: 0,
    selectedTaskId: 0,
    selectedRecurrenceIndex: -1
  }
};

const calendarReducer = createReducer(INITIAL_CALENDAR_STATE)
  .handleAction(
    actions.setSelectedTaskId,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedTaskId: payload.taskId,
          selectedPeriodId: 0,
          selectedRecurrenceIndex: payload.recurrenceIndex
        }
      };
    }
  )
  .handleAction(
    actions.setSelectedPeriodId,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedTaskId: 0,
          selectedPeriodId: payload.periodId,
          selectedRecurrenceIndex: payload.recurrenceIndex
        }
      };
    }
  )
  .handleAction(actions.deselectTasks, (state: CalendarState) => {
    return {
      ...state,
      ui: {
        ...state.ui,
        selectedTaskId: 0,
        selectedPeriodId: 0,
        selectedRecurrenceIndex: -1
      }
    };
  });

export { calendarReducer };

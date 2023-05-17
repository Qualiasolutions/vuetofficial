import { CalendarState } from './types';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

export type CalendarAction = ActionType<typeof actions>;

const INITIAL_CALENDAR_STATE: CalendarState = {
  data: {},
  ui: {
    selectedPeriodId: 0,
    selectedTaskId: 0,
    selectedReminderId: 0,
    selectedRecurrenceIndex: -1,
    listEnforcedDate: "",
    monthEnforcedDate: "",
    enforcedDate: ""
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
          selectedReminderId: 0,
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
          selectedReminderId: 0,
          selectedRecurrenceIndex: payload.recurrenceIndex
        }
      };
    }
  )
  .handleAction(
    actions.setSelectedReminderId,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedTaskId: 0,
          selectedPeriodId: 0,
          selectedReminderId: payload.reminderId,
          selectedRecurrenceIndex: -1
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
        selectedReminderId: 0,
        selectedRecurrenceIndex: -1
      }
    };
  })
  .handleAction(actions.setListEnforcedDate, (state: CalendarState, { payload }) => {
    return {
      ...state,
      ui: {
        ...state.ui,
        listEnforcedDate: payload.date,
        enforcedDate: payload.date,
      }
    };
  })
  .handleAction(actions.setMonthEnforcedDate, (state: CalendarState, { payload }) => {
    return {
      ...state,
      ui: {
        ...state.ui,
        monthEnforcedDate: payload.date,
        enforcedDate: payload.date
      }
    };
  });

export { calendarReducer };

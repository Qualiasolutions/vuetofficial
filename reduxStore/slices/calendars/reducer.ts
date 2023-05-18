import { CalendarState } from './types';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

export type CalendarAction = ActionType<typeof actions>;

const INITIAL_CALENDAR_STATE: CalendarState = {
  data: {},
  ui: {
    listEnforcedDate: "",
    monthEnforcedDate: "",
    enforcedDate: ""
  }
};

const calendarReducer = createReducer(INITIAL_CALENDAR_STATE)
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

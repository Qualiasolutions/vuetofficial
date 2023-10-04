import { CalendarState } from './types';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

export type CalendarAction = ActionType<typeof actions>;

const INITIAL_CALENDAR_STATE: CalendarState = {
  data: {
    filteredUsers: [],
    filteredEntities: [],
    filteredTags: [],
    filteredCategories: [],
    taskToAction: null
  },
  ui: {
    enforcedDate: '',
    actionDrawerOpen: false,
    lastUpdateId: null
  }
};

const calendarReducer = createReducer(INITIAL_CALENDAR_STATE)
  .handleAction(
    actions.setEnforcedDate,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        ui: {
          ...state.ui,
          enforcedDate: payload.date
        }
      };
    }
  )
  .handleAction(
    actions.setLastUpdateId,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        ui: {
          ...state.ui,
          lastUpdateId: payload
        }
      };
    }
  )
  .handleAction(
    actions.setFilteredUsers,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        data: {
          ...state.data,
          filteredUsers: payload.users
        }
      };
    }
  )
  .handleAction(
    actions.setFilteredEntities,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        data: {
          ...state.data,
          filteredEntities: payload.entities
        }
      };
    }
  )
  .handleAction(
    actions.setFilteredTags,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        data: {
          ...state.data,
          filteredTags: payload.tags
        }
      };
    }
  )
  .handleAction(
    actions.setFilteredCategories,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        data: {
          ...state.data,
          filteredCategories: payload.categories
        }
      };
    }
  )
  .handleAction(
    actions.setTaskToAction,
    (state: CalendarState, { payload }) => {
      return {
        ...state,
        data: {
          ...state.data,
          taskToAction: payload
        }
      };
    }
  );

export { calendarReducer };

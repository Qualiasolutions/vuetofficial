import { createSelector } from '@reduxjs/toolkit';
import taskCompletionFormsApi from 'reduxStore/services/api/taskCompletionForms';
import tasksApi from 'reduxStore/services/api/tasks';
import { EntireState } from 'reduxStore/types';
import { ScheduledTaskResponseType } from 'types/tasks';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';
import { CalendarState } from './types';

export const selectCalendarState = (
  state: EntireState
): CalendarState | undefined => state?.calendar;

export const selectListEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.listEnforcedDate
);

export const selectMonthEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.monthEnforcedDate
);

export const selectEnforcedDate = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.ui?.enforcedDate
);

export const selectFilteredUsers = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.filteredUsers
);

export const selectFilteredEntities = createSelector(
  selectCalendarState,
  (calendar: CalendarState | undefined) => calendar?.data?.filteredEntities
);

export const selectScheduledTaskIdsByDate = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(),
  (scheduledTasks) => {
    return scheduledTasks.data?.byDate;
  }
);

const isTask = (
  item: ScheduledTaskResponseType | undefined
): item is ScheduledTaskResponseType => {
  return !!item;
};

export const selectFilteredScheduledTaskIdsByDate = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(null as any),
  selectFilteredEntities,
  selectFilteredUsers,
  (scheduledTasks, entities, users) => {
    if (!scheduledTasks.data) {
      return {};
    }

    const filteredTasks =
      scheduledTasks.data.ordered
        .map(
          ({ id, recurrence_index }) =>
            scheduledTasks.data?.byTaskId[id][
              recurrence_index === null ? -1 : recurrence_index
            ]
        )
        .filter(isTask)
        .filter(
          (task) =>
            (!entities ||
              entities.length === 0 ||
              task.entities.some((ent) => entities?.includes(ent))) &&
            (!users ||
              users.length === 0 ||
              task.members.some((member) => users?.includes(member)))
        ) || [];

    const formatted = formatTasksPerDate(filteredTasks);

    return formatted;
  }
);

export const selectIsComplete = ({
  id,
  recurrenceIndex
}: {
  id: number;
  recurrenceIndex: number | null;
}) =>
  createSelector(
    taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(),
    (taskCompletionForms) => {
      return !!(
        taskCompletionForms.data?.byTaskId[id] &&
        taskCompletionForms.data?.byTaskId[id][
          recurrenceIndex === null ? -1 : recurrenceIndex
        ]
      );
    }
  );

export const selectScheduledTask = ({
  id,
  recurrenceIndex
}: {
  id: number;
  recurrenceIndex: number | null;
}) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(null as any),
    (scheduledTasks) => {
      return scheduledTasks.data?.byTaskId[id][
        recurrenceIndex === null ? -1 : recurrenceIndex
      ];
    }
  );

export const selectTask = (id: number) =>
  createSelector(
    tasksApi.endpoints.getAllTasks.select(null as any),
    (tasks) => {
      return tasks.data?.byId[id];
    }
  );

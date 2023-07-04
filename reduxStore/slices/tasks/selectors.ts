import { createSelector } from '@reduxjs/toolkit';
import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import dayjs from 'dayjs';
import entitiesApi from 'reduxStore/services/api/entities';
import routinesApi from 'reduxStore/services/api/routines';
import taskActionsApi from 'reduxStore/services/api/taskActions';
import taskCompletionFormsApi from 'reduxStore/services/api/taskCompletionForms';
import tasksApi from 'reduxStore/services/api/tasks';
import { DayType } from 'types/datesAndTimes';
import { EntityTypeName } from 'types/entities';
import { ScheduledTaskResponseType } from 'types/tasks';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';
import {
  selectFilteredEntities,
  selectFilteredUsers
} from '../calendars/selectors';

export const selectTaskById = (id: number) =>
  createSelector(
    tasksApi.endpoints.getAllTasks.select(null as any),
    (tasks) => {
      return tasks.data?.byId && tasks.data?.byId[id];
    }
  );

export const selectTaskActionById = (id: number) =>
  createSelector(
    taskActionsApi.endpoints.getAllTaskActions.select(null as any),
    (taskActions) => {
      return (taskActions.data?.byId && taskActions.data?.byId[id]) || null;
    }
  );

export const selectNewTaskIds = createSelector(
  tasksApi.endpoints.getAllTasks.select(null as any),
  (tasks) => {
    const tasksData = tasks?.data;
    if (!tasksData) {
      return [];
    }
    const reverseSortedIds = [...tasksData.ids].sort((a, b) =>
      a < b ? 1 : -1
    );
    const newIds = [];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    for (const id of reverseSortedIds) {
      if (new Date(tasksData.byId[id].created_at) > threeDaysAgo) {
        newIds.push(id);
        continue;
      }
      // If the latest ID is not new then neathir is anything older
      return newIds;
    }
    return newIds;
  }
);

export const selectOverdueTasks = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(null as any),
  taskActionsApi.endpoints.getAllTaskActions.select(null as any),
  taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(null as any),
  (tasks, taskActions, taskCompletionForms) => {
    const tasksData = tasks?.data;
    const taskActionsData = taskActions?.data;
    const taskCompletionFormsData = taskCompletionForms?.data;

    if (!tasksData || !taskActionsData || !taskCompletionFormsData) {
      return [];
    }

    const overdueTasks: ScheduledTaskResponseType[] = [];
    for (const {
      id,
      recurrence_index: recIndex,
      action_id: actionId
    } of tasksData.ordered) {
      const task = actionId
        ? tasksData.byActionId[actionId]
        : tasksData.byTaskId[id][recIndex === null ? -1 : recIndex];

      const taskDatetimeString = task.start_datetime || task.date;
      if (!taskDatetimeString) {
        continue;
      }

      const isComplete = actionId
        ? taskActionsData.byId[actionId]?.is_complete
        : !!(
            taskCompletionFormsData.byTaskId[id] &&
            taskCompletionFormsData.byTaskId[id][
              recIndex === null ? -1 : recIndex
            ]
          );

      if (!isComplete) {
        const taskStart = new Date(taskDatetimeString);
        if (taskStart < new Date() && !task.is_complete) {
          overdueTasks.push(task);
        }
        if (taskStart > new Date()) {
          return overdueTasks;
        }
      }
    }

    return overdueTasks;
  }
);

export const selectTasksInDailyRoutines = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(null as any),
  routinesApi.endpoints.getAllRoutines.select(null as any),
  (tasks, routines) => {
    const taskData = tasks.data;
    const routinesData = routines.data;

    if (!taskData || !routinesData) {
      return {};
    }

    const dateTasksPerRoutine: {
      [date: string]: {
        [routine: number]: MinimalScheduledTask[];
      };
    } = {};

    for (const date in taskData.byDate) {
      const dayJsDate = dayjs(date);
      const weekdayName = dayJsDate.format('dddd').toLowerCase() as DayType;

      const dayRoutines =
        routinesData.ids
          .filter((id) => routinesData.byId[id][weekdayName])
          .map((id) => routinesData.byId[id]) || [];

      const routineTasks: { [key: number]: MinimalScheduledTask[] } = {};
      for (const routine of dayRoutines) {
        routineTasks[routine.id] = [];
      }

      const nonRoutineTasks: MinimalScheduledTask[] = [];

      const taskObjects = taskData.byDate[date].map((task) => {
        if (task.action_id) {
          return taskData.byActionId[task.action_id];
        }
        return taskData.byTaskId[task.id][
          task.recurrence_index === null ? -1 : task.recurrence_index
        ];
      });

      const formattedTaskObjects = formatTasksPerDate(taskObjects);

      for (const taskObj of formattedTaskObjects[date]) {
        const task = {
          id: taskObj.id,
          recurrence_index: taskObj.recurrence_index,
          action_id: taskObj.action_id,
          type: taskObj.type
        };

        if (taskObj.start_datetime && taskObj.end_datetime) {
          // In this case the task is a fixed task
          const startTime = new Date(taskObj.start_datetime || '');
          const startDate = dayjs(startTime).format('YYYY-MM-DD');
          const endTime = new Date(taskObj.end_datetime || '');
          const endDate = dayjs(endTime).format('YYYY-MM-DD');
          const multiDay = startDate !== endDate;

          if (multiDay) {
            nonRoutineTasks.push(task);
            continue;
          }

          let addedToRoutine = false;
          for (const routine of dayRoutines) {
            if (
              dayjs(taskObj.start_datetime).format('HH:mm:dd') >=
                routine.start_time &&
              dayjs(taskObj.end_datetime).format('HH:mm:dd') <= routine.end_time
            ) {
              routineTasks[routine.id].push(task);
              addedToRoutine = true;
            }
          }
          if (!addedToRoutine) {
            nonRoutineTasks.push(task);
          }
        } else {
          // Otherwise it is a due date and we place
          // it in a routine if it is assigned to one
          if (taskObj.routine) {
            routineTasks[taskObj.routine].push(task);
            continue;
          }
          nonRoutineTasks.push(task);
        }
      }

      const routineIdsToShow = Object.keys(routineTasks)
        .filter((routineId) => routineTasks[parseInt(routineId)].length > 0)
        .map((id) => parseInt(id));

      for (const routineId of routineIdsToShow) {
        if (!dateTasksPerRoutine[date]) {
          dateTasksPerRoutine[date] = {};
        }
        dateTasksPerRoutine[date][routineId] = routineTasks[routineId];
      }

      if (!dateTasksPerRoutine[date]) {
        dateTasksPerRoutine[date] = {};
      }

      dateTasksPerRoutine[date][-1] = nonRoutineTasks;
    }

    return dateTasksPerRoutine;
  }
);

export const selectTasksForRoutineForDate = (routine: number, date: string) => {
  return createSelector(selectTasksInDailyRoutines, (dailyTasksPerRoutine) => {
    return dailyTasksPerRoutine[date][routine];
  });
};

const isTask = (
  item: ScheduledTaskResponseType | undefined
): item is ScheduledTaskResponseType => {
  return !!item;
};

export const selectScheduledTaskIdsByEntityTypes = (
  entityTypes: EntityTypeName[]
) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(null as any),
    entitiesApi.endpoints.getAllEntities.select(null as any),
    (scheduledTasks, allEntities) => {
      const entitiesData = allEntities.data;
      const taskData = scheduledTasks.data;
      if (!taskData || !entitiesData) {
        return {};
      }

      const filteredTasks =
        taskData.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            if (['FixedTask', 'DueDate'].includes(resourcetype)) {
              return taskData.byTaskId[id][
                recurrence_index === null ? -1 : recurrence_index
              ];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !entityTypes ||
              entityTypes.length === 0 ||
              task.entities.some(
                (ent) =>
                  entitiesData.byId[ent] &&
                  entityTypes.includes(entitiesData.byId[ent].resourcetype)
              )
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

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
        .map(({ id, recurrence_index, resourcetype, action_id }) => {
          if (['FixedTask', 'DueDate'].includes(resourcetype)) {
            return scheduledTasks.data?.byTaskId[id][
              recurrence_index === null ? -1 : recurrence_index
            ];
          }

          if (action_id) {
            return scheduledTasks.data?.byActionId[action_id];
          }
        })
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

export const selectScheduledTaskIdsByEntityIds = (entities: number[]) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(null as any),
    (scheduledTasks) => {
      if (!scheduledTasks.data) {
        return {};
      }

      const filteredTasks =
        scheduledTasks.data.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            if (['FixedTask', 'DueDate'].includes(resourcetype)) {
              return scheduledTasks.data?.byTaskId[id][
                recurrence_index === null ? -1 : recurrence_index
              ];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !entities ||
              entities.length === 0 ||
              task.entities.some((ent) => entities?.includes(ent))
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

export const selectScheduledTaskIdsByTagNames = (tagNames: string[]) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(null as any),
    (scheduledTasks) => {
      if (!scheduledTasks.data) {
        return {};
      }

      const filteredTasks =
        scheduledTasks.data.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            if (['FixedTask', 'DueDate'].includes(resourcetype)) {
              return scheduledTasks.data?.byTaskId[id][
                recurrence_index === null ? -1 : recurrence_index
              ];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !tagNames ||
              tagNames.length === 0 ||
              task.tags.some((tagName) => tagNames?.includes(tagName))
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

export const selectScheduledTaskIdsByCategories = (categories: number[]) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(null as any),
    entitiesApi.endpoints.getAllEntities.select(null as any),
    (scheduledTasks, allEntities) => {
      const entitiesData = allEntities.data;
      const taskData = scheduledTasks.data;
      if (!taskData || !entitiesData) {
        return {};
      }

      const filteredTasks =
        taskData.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            if (['FixedTask', 'DueDate'].includes(resourcetype)) {
              return taskData.byTaskId[id][
                recurrence_index === null ? -1 : recurrence_index
              ];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !categories ||
              categories.length === 0 ||
              task.entities.some((ent) =>
                categories.some(
                  (cat) =>
                    entitiesData.byId[ent] &&
                    entitiesData.byId[ent].category === cat
                )
              )
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

export const selectIsComplete = ({
  id,
  recurrenceIndex,
  actionId
}: {
  id: number;
  recurrenceIndex: number | null;
  actionId: number | null;
}) =>
  createSelector(
    taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(null as any),
    selectTaskActionById(actionId || -1),
    (taskCompletionForms, taskAction) => {
      if (actionId) {
        return {
          isComplete: taskAction?.is_complete,
          isIgnored: false
        };
      }
      const completionForm =
        taskCompletionForms.data?.byTaskId[id] &&
        taskCompletionForms.data?.byTaskId[id][
          recurrenceIndex === null ? -1 : recurrenceIndex
        ];
      return {
        isComplete: !!completionForm,
        isIgnored: !!(completionForm && completionForm.ignore)
      };
    }
  );

export const selectScheduledTask = ({
  id,
  recurrenceIndex,
  actionId
}: {
  id?: number | null;
  recurrenceIndex?: number | null;
  actionId?: number | null;
}) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(null as any),
    (scheduledTasks) => {
      if (actionId) {
        return scheduledTasks.data?.byActionId[actionId];
      }
      if (id) {
        return scheduledTasks.data?.byTaskId[id][
          recurrenceIndex === null || recurrenceIndex === undefined
            ? -1
            : recurrenceIndex
        ];
      }
    }
  );

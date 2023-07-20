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
import {
  HiddenTagType,
  ScheduledEntityResponseType,
  ScheduledTaskResponseType
} from 'types/tasks';
import {
  formatEntitiesPerDate,
  formatTasksPerDate
} from 'utils/formatTasksAndPeriods';
import {
  selectFilteredEntities,
  selectFilteredTags,
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
  taskCompletionFormsApi.endpoints.getTaskActionCompletionForms.select(
    null as any
  ),
  (tasks, taskActions, taskCompletionForms, taskActionCompletionForms) => {
    const tasksData = tasks?.data;
    const taskActionsData = taskActions?.data;
    const taskCompletionFormsData = taskCompletionForms?.data;
    const taskActionCompletionFormsData = taskActionCompletionForms?.data;

    if (
      !tasksData ||
      !taskActionsData ||
      !taskCompletionFormsData ||
      !taskActionCompletionFormsData
    ) {
      return [];
    }

    const overdueTasks: ScheduledTaskResponseType[] = [];
    for (const {
      id,
      recurrence_index: recIndex,
      action_id: actionId
    } of tasksData.ordered) {
      const recurrenceIndex = recIndex === null ? -1 : recIndex;
      const task = actionId
        ? tasksData.byActionId[actionId][recurrenceIndex]
        : tasksData.byTaskId[id][recurrenceIndex];

      const taskDatetimeString = task?.start_datetime || task?.date;
      if (!taskDatetimeString) {
        continue;
      }

      const isComplete = actionId
        ? !!(
            taskActionCompletionFormsData.byActionId[actionId] &&
            taskActionCompletionFormsData.byActionId[actionId][recurrenceIndex]
          )
        : !!(
            taskCompletionFormsData.byTaskId[id] &&
            taskCompletionFormsData.byTaskId[id][recurrenceIndex]
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
        const recurrenceIndex =
          task.recurrence_index === null ? -1 : task.recurrence_index;
        if (task.action_id) {
          return taskData.byActionId[task.action_id][recurrenceIndex];
        }
        return taskData.byTaskId[task.id][recurrenceIndex];
      });

      const formattedTaskObjects = formatTasksPerDate(taskObjects);
      if (formattedTaskObjects[date]) {
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
                dayjs(taskObj.end_datetime).format('HH:mm:dd') <=
                  routine.end_time
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

const isEntity = (
  item: ScheduledEntityResponseType | undefined
): item is ScheduledEntityResponseType => {
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
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return taskData.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
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
  selectFilteredTags,
  selectFilteredUsers,
  (scheduledTasks, entities, tags, users) => {
    if (!scheduledTasks.data) {
      return {};
    }

    const filteredTasks =
      scheduledTasks.data.ordered
        .map(({ id, recurrence_index, resourcetype, action_id }) => {
          const recurrenceIndex =
            recurrence_index === null ? -1 : recurrence_index;
          if (['FixedTask'].includes(resourcetype)) {
            return scheduledTasks.data?.byTaskId[id][recurrenceIndex];
          }

          if (action_id) {
            return scheduledTasks.data?.byActionId[action_id][recurrenceIndex];
          }
        })
        .filter(isTask)
        .filter(
          (task) =>
            ((!entities && !tags) ||
              (entities &&
                entities.length === 0 &&
                tags &&
                tags.length === 0) ||
              task.entities.some((ent) => entities?.includes(ent)) ||
              task.tags.some((tagName) => tags?.includes(tagName))) &&
            (!users ||
              users.length === 0 ||
              task.members.some((member) => users?.includes(member)))
        ) || [];

    const formatted = formatTasksPerDate(filteredTasks);

    return formatted;
  }
);

export const selectFilteredScheduledEntityIdsByDate = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(null as any),
  selectFilteredEntities,
  selectFilteredTags,
  selectFilteredUsers,
  (scheduledTasks, entities, tags, users) => {
    if (!scheduledTasks.data?.orderedEntities) {
      return {};
    }

    const filteredEntities =
      scheduledTasks.data.orderedEntities
        .map(({ id }) => {
          return scheduledTasks.data?.byEntityId[id];
        })
        .filter(isEntity)
        .filter(
          (entity) =>
            ((!entities && !tags) ||
              (entities &&
                entities.length === 0 &&
                tags &&
                tags.length === 0) ||
              entities?.includes(entity.id)) &&
            (!users ||
              users.length === 0 ||
              entity.members.some((member) => users?.includes(member)))
        ) || [];

    const formatted = formatEntitiesPerDate(filteredEntities);

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
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return scheduledTasks.data?.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
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
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return scheduledTasks.data?.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
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
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return taskData.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
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
    taskCompletionFormsApi.endpoints.getTaskActionCompletionForms.select(
      null as any
    ),
    (taskCompletionForms, taskActionCompletionForms) => {
      if (actionId) {
        const completionForm =
          taskActionCompletionForms.data?.byActionId[actionId] &&
          taskActionCompletionForms.data?.byActionId[actionId][
            recurrenceIndex === null ? -1 : recurrenceIndex
          ];
        return {
          isComplete: !!completionForm,
          isIgnored: !!(completionForm && completionForm.ignore)
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
      const recIndex =
        recurrenceIndex === null || recurrenceIndex === undefined
          ? -1
          : recurrenceIndex;
      if (actionId) {
        return scheduledTasks.data?.byActionId[actionId][recIndex];
      }
      if (id) {
        return (
          scheduledTasks.data?.byTaskId &&
          scheduledTasks.data?.byTaskId[id] &&
          scheduledTasks.data?.byTaskId[id][recIndex]
        );
      }
    }
  );

export const selectTasksFromEntityAndHiddenTag = (
  entityId: number,
  tagName: HiddenTagType
) =>
  createSelector(
    tasksApi.endpoints.getAllTasks.select(null as any),
    (tasks) => {
      const taskData = tasks.data;

      if (!taskData) {
        return [];
      }
      return taskData?.ids
        .filter((id) => {
          const task = taskData.byId[id];
          return (
            task.entities.includes(entityId) && task.hidden_tag === tagName
          );
        })
        .map((id) => taskData.byId[id]);
    }
  );

export const selectNextTaskFromEntityAndHiddenTag = (
  entityId: number,
  tagName: HiddenTagType
) =>
  createSelector(
    selectTasksFromEntityAndHiddenTag(entityId, tagName),
    (tasks) => {
      const sortedTasks = tasks.sort((taskA, taskB) => {
        const taskAStart = taskA.start_datetime || taskA.date;
        const taskBStart = taskB.start_datetime || taskB.date;
        if (!(taskAStart && taskBStart)) {
          return 0;
        }
        return taskAStart < taskBStart ? -1 : 1;
      });

      const now = new Date();
      for (const task of sortedTasks) {
        if (task.start_datetime && new Date(task.start_datetime) > now) {
          return task;
        }
        if (task.date && new Date(task.date) > now) {
          return task;
        }
      }

      return null;
    }
  );

import { createSelector } from '@reduxjs/toolkit';
import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import dayjs from 'dayjs';
import routinesApi from 'reduxStore/services/api/routines';
import taskCompletionFormsApi from 'reduxStore/services/api/taskCompletionForms';
import tasksApi from 'reduxStore/services/api/tasks';
import { DayType } from 'types/datesAndTimes';
import { ScheduledTaskResponseType } from 'types/tasks';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';

export const selectTaskById = (id: number) =>
  createSelector(
    tasksApi.endpoints.getAllTasks.select(null as any),
    (tasks) => {
      return tasks.data?.byId[id];
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
  taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(null as any),
  (tasks, taskCompletionForms) => {
    const tasksData = tasks?.data;
    const taskCompletionFormsData = taskCompletionForms?.data;

    if (!tasksData || !taskCompletionFormsData) {
      return [];
    }

    const overdueTasks: ScheduledTaskResponseType[] = [];
    for (const { id, recurrence_index: recIndex } of tasksData.ordered) {
      const task = tasksData.byTaskId[id][recIndex === null ? -1 : recIndex];

      const taskDatetimeString = task.start_datetime || task.date;
      if (!taskDatetimeString) {
        continue;
      }

      const isComplete = !!(
        taskCompletionFormsData.byTaskId[id] &&
        taskCompletionFormsData.byTaskId[id][recIndex === null ? -1 : recIndex]
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

      const taskObjects = taskData.byDate[date].map(
        (task) =>
          taskData.byTaskId[task.id][
            task.recurrence_index === null ? -1 : task.recurrence_index
          ]
      );

      const formattedTaskObjects = formatTasksPerDate(taskObjects);

      for (const taskObj of formattedTaskObjects[date]) {
        const task = {
          id: taskObj.id,
          recurrence_index: taskObj.recurrence_index
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
            nonRoutineTasks.push({
              id: taskObj.id,
              recurrence_index: taskObj.recurrence_index
            });
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

import { createSelector } from '@reduxjs/toolkit';
import taskCompletionFormsApi from 'reduxStore/services/api/taskCompletionForms';
import tasksApi from 'reduxStore/services/api/tasks';
import { ScheduledTaskResponseType } from 'types/tasks';

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

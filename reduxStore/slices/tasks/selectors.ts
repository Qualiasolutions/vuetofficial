import { createSelector } from '@reduxjs/toolkit';
import tasksApi from 'reduxStore/services/api/tasks';

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

import { createSelector } from '@reduxjs/toolkit';
import alertsApi from 'reduxStore/services/api/alerts';

export const selectAlertsByTaskId = (taskId: number) =>
  createSelector(alertsApi.endpoints.getAllAlerts.select(), (alerts) => {
    const alertsData = alerts?.data;
    if (!alertsData) {
      return [];
    }
    return alertsData.byTask[taskId];
  });

export const selectAlertById = (alertId: number) =>
  createSelector(alertsApi.endpoints.getAllAlerts.select(), (alerts) => {
    const alertsData = alerts?.data;
    if (!alertsData) {
      return null;
    }
    return alertsData.byId[alertId];
  });

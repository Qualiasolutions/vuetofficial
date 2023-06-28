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

export const selectAlertsByActionId = (actionId: number) =>
  createSelector(alertsApi.endpoints.getAllActionAlerts.select(), (alerts) => {
    const alertsData = alerts?.data;
    if (!alertsData) {
      return [];
    }
    return alertsData.byAction[actionId];
  });

export const selectAlertById = (alertId: number) =>
  createSelector(alertsApi.endpoints.getAllAlerts.select(), (alerts) => {
    const alertsData = alerts?.data;
    if (!alertsData) {
      return null;
    }
    return alertsData.byId[alertId];
  });

export const selectActionAlertById = (alertId: number) =>
  createSelector(alertsApi.endpoints.getAllActionAlerts.select(), (alerts) => {
    const alertsData = alerts?.data;
    if (!alertsData) {
      return null;
    }
    return alertsData.byId[alertId];
  });

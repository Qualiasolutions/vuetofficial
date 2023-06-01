import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { ParsedPeriod } from 'types/periods';
import { ScheduledTaskResponseType } from 'types/tasks';
import {
  getDateStringFromDateObject,
  getDateStringsBetween,
  getEndOfDay,
  getStartOfDay
} from './datesAndTimes';

type SingleDateTasks = {
  tasks: MinimalScheduledTask[];
  periods: ParsedPeriod[];
};

type AllDateTasks = {
  [key: string]: SingleDateTasks;
};

export const formatTasksPerDate = (tasks: ScheduledTaskResponseType[]) => {
  const newTasksPerDate: {
    [key: string]: MinimalScheduledTask[];
  } = {};
  for (const task of tasks) {
    const taskDates = getDateStringsBetween(
      task.start_datetime,
      task.end_datetime
    );

    taskDates.forEach((taskDate) => {
      const taskToPush = {
        id: task.id,
        recurrence_index: task.recurrence_index
      };
      if (newTasksPerDate[taskDate]) {
        newTasksPerDate[taskDate].push(taskToPush);
      } else {
        newTasksPerDate[taskDate] = [taskToPush];
      }
    });
  }

  return newTasksPerDate;
};

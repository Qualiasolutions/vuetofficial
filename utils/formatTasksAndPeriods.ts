import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { ParsedPeriod } from 'types/periods';
import {
  getDateStringFromDateObject,
  getDateStringsBetween
} from './datesAndTimes';

type SingleDateTasks = {
  tasks: MinimalScheduledTask[];
  periods: ParsedPeriod[];
};

type AllDateTasks = {
  [key: string]: SingleDateTasks;
};

export default function formatTasksAndPeriods(
  tasks: MinimalScheduledTask[],
  periods: ParsedPeriod[],
  alwaysIncludeCurrentDate?: boolean
) {
  const newTasksPerDate: AllDateTasks = {};
  for (const task of tasks) {
    const taskDates = getDateStringsBetween(
      task.start_datetime,
      task.end_datetime
    );

    for (const taskDate of taskDates) {
      if (newTasksPerDate[taskDate]) {
        newTasksPerDate[taskDate].tasks.push(task);
      } else {
        newTasksPerDate[taskDate] = {
          tasks: [task],
          periods: []
        };
      }
    }
  }

  for (const parsedPeriod of periods) {
    const periodDates = getDateStringsBetween(
      parsedPeriod.start_date,
      parsedPeriod.end_date,
      true // Use UTC
    );

    for (const periodDate of periodDates) {
      if (newTasksPerDate[periodDate]) {
        newTasksPerDate[periodDate].periods.push(parsedPeriod);
      } else {
        newTasksPerDate[periodDate] = {
          tasks: [],
          periods: [parsedPeriod]
        };
      }
    }
  }

  if (alwaysIncludeCurrentDate) {
    const currentDate = new Date();
    const currentDateString = getDateStringFromDateObject(currentDate);
    if (!(currentDateString in newTasksPerDate)) {
      newTasksPerDate[currentDateString] = {
        tasks: [],
        periods: []
      };
    }
  }

  return newTasksPerDate;
}

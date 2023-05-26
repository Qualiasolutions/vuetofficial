import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { ParsedPeriod } from 'types/periods';
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

    const isMultiDay = taskDates.length > 1;

    taskDates.forEach((taskDate, i) => {
      const taskToPush = {
        ...task,
        end_datetime:
          isMultiDay && i !== taskDates.length - 1
            ? getEndOfDay(task.end_datetime)
            : task.end_datetime,
        start_datetime:
          isMultiDay && i !== 0
            ? getStartOfDay(task.start_datetime)
            : task.start_datetime
      };
      if (newTasksPerDate[taskDate]) {
        newTasksPerDate[taskDate].tasks.push(taskToPush);
      } else {
        newTasksPerDate[taskDate] = {
          tasks: [taskToPush],
          periods: []
        };
      }
    });
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

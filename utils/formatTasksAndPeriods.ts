import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { ScheduledTaskResponseType } from 'types/tasks';
import { getDateStringsBetween } from './datesAndTimes';

export const formatTasksPerDate = (tasks: ScheduledTaskResponseType[]) => {
  const newTasksPerDate: {
    [key: string]: (MinimalScheduledTask & {
      start_datetime: string;
      end_datetime: string;
    })[];
  } = {};
  for (const task of tasks) {
    const taskDates = getDateStringsBetween(
      task.start_datetime,
      task.end_datetime
    );

    taskDates.forEach((taskDate) => {
      const taskToPush = {
        id: task.id,
        recurrence_index: task.recurrence_index,
        start_datetime: task.start_datetime,
        end_datetime: task.end_datetime
      };
      if (newTasksPerDate[taskDate]) {
        let spliceIndex = 0;
        for (const insertedTask of newTasksPerDate[taskDate]) {
          if (insertedTask.start_datetime < taskToPush.start_datetime) {
            spliceIndex += 1;
          } else {
            break;
          }
        }
        newTasksPerDate[taskDate].splice(spliceIndex, 0, taskToPush);
      } else {
        newTasksPerDate[taskDate] = [taskToPush];
      }
    });
  }

  return newTasksPerDate;
};

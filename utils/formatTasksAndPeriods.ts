import { ScheduledEntity } from 'components/calendars/TaskCalendar/components/Task';
import {
  ScheduledEntityResponseType,
  ScheduledTaskResponseType,
  ScheduledTaskType
} from 'types/tasks';
import { getDateStringsBetween } from './datesAndTimes';

export const formatTasksPerDate = (tasks: ScheduledTaskResponseType[]) => {
  const newTasksPerDate: {
    [key: string]: {
      id: number;
      recurrence_index: number | null;
      start_datetime?: string;
      end_datetime?: string;
      date?: string;
      duration?: number;
      routine: number | null;
      type: ScheduledTaskType;
      action_id: number | null;
    }[];
  } = {};
  for (const task of tasks) {
    if (!task) {
      continue;
    }
    let taskDates: string[] = [];
    if (task.start_datetime && task.end_datetime) {
      taskDates = getDateStringsBetween(task.start_datetime, task.end_datetime);
    }
    if (task.start_date && task.end_date) {
      taskDates = getDateStringsBetween(task.start_date, task.end_date);
    }
    if (task.date) {
      taskDates = [task.date];
    }

    taskDates.forEach((taskDate) => {
      const taskToPush = {
        id: task.id,
        recurrence_index: task.recurrence_index,
        start_datetime: task.start_datetime,
        type: (task.resourcetype === 'TaskAction'
          ? 'ACTION'
          : 'TASK') as ScheduledTaskType,
        end_datetime: task.end_datetime,
        routine: task.routine,
        action_id: task.action_id
      };
      if (newTasksPerDate[taskDate]) {
        let spliceIndex = 0;
        for (const insertedTask of newTasksPerDate[taskDate]) {
          if (!taskToPush.start_datetime) {
            break;
          }
          if (
            !insertedTask.start_datetime ||
            insertedTask.start_datetime < taskToPush.start_datetime
          ) {
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

export const formatEntitiesPerDate = (
  entities: ScheduledEntityResponseType[]
) => {
  const entitiesPerDate: {
    [key: string]: ScheduledEntity[];
  } = {};
  for (const entity of entities) {
    if (!entity) {
      continue;
    }

    const entityDates =
      entity.start_date && entity.end_date
        ? getDateStringsBetween(entity.start_date, entity.end_date)
        : [];

    entityDates.forEach((entityDate) => {
      if (!entitiesPerDate[entityDate]) {
        entitiesPerDate[entityDate] = [];
      }

      entitiesPerDate[entityDate].push({
        id: entity.id,
        resourcetype: entity.resourcetype
      });
    });
  }

  return entitiesPerDate;
};

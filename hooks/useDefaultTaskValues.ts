import { useFieldTypesForTask } from 'components/forms/taskFormFieldTypes';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { useMemo } from 'react';
import { getTimeInTimezone } from 'utils/datesAndTimes';
import { useSelector } from 'react-redux';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import createInitialObject from 'components/forms/utils/createInitialObject';

export default function useDefaultTaskValues(
  taskId: number,
  recurrenceIndex?: number
) {
  const taskObj = useSelector(selectTaskById(taskId));
  const scheduledTaskObj = useSelector(
    selectScheduledTask({
      id: taskId,
      recurrenceIndex
    })
  );
  const { data: userDetails } = useGetUserDetails();
  const taskFields = useFieldTypesForTask(taskObj);

  console.log('taskFields');
  console.log(taskFields);

  const defaultValues = useMemo(() => {
    if (taskObj && scheduledTaskObj && userDetails) {
      if (taskObj.start_timezone && taskObj.start_datetime) {
        const newStart = getTimeInTimezone(
          taskObj.start_datetime,
          taskObj.start_timezone
        );

        taskObj.start_datetime = newStart;
      }
      if (taskObj.end_timezone && taskObj.end_datetime) {
        const newEnd = getTimeInTimezone(
          taskObj.end_datetime,
          taskObj.end_timezone
        );
        taskObj.end_datetime = newEnd;
      }

      if (scheduledTaskObj.start_date) {
        scheduledTaskObj.date = scheduledTaskObj.start_date;
      }

      const newTaskToEdit = {
        ...taskObj,
        date: (recurrenceIndex
          ? scheduledTaskObj.date
          : taskObj.date) as string,
        start_datetime: scheduledTaskObj.start_datetime
          ? new Date(scheduledTaskObj.start_datetime)
          : undefined,
        end_datetime: scheduledTaskObj.end_datetime
          ? new Date(scheduledTaskObj.end_datetime)
          : undefined,
        is_any_time: !!scheduledTaskObj.date,
        tagsAndEntities: {
          entities: taskObj.entities,
          tags: taskObj.tags || []
        }
      };

      const initialTaskFields = createInitialObject(
        taskFields,
        userDetails,
        newTaskToEdit
      );
      return initialTaskFields;
    }
  }, [taskObj, scheduledTaskObj, userDetails, taskFields, recurrenceIndex]);

  console.log(defaultValues);

  return defaultValues;
}

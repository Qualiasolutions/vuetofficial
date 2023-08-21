import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericAddTaskForm from 'components/forms/GenericAddTaskForm';
import { useSelector } from 'react-redux';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import { RootTabParamList } from 'types/base';

export default function EditTaskOccurrenceScreen({
  route,
  navigation
}: NativeStackScreenProps<RootTabParamList, 'EditTaskOccurrence'>) {
  const { taskId, recurrenceIndex } = route.params;
  const taskObj = useSelector(selectTaskById(taskId));
  const scheduledTaskObj = useSelector(
    selectScheduledTask({ id: taskId, recurrenceIndex })
  );

  if (!(taskObj && scheduledTaskObj && taskObj.recurrence)) {
    return null;
  }

  return (
    <GenericAddTaskForm
      type={taskObj.type}
      defaults={{
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
        is_any_time: !!scheduledTaskObj.date
      }}
      onSuccess={() => navigation.goBack()}
      recurrenceOverwrite={true}
      recurrenceIndex={recurrenceIndex}
      taskId={taskId}
    />
  );

  return null;
}

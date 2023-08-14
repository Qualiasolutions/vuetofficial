import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AddAnniversaryForm from 'components/forms/AddAnniversaryForm';
import AddDueDateForm from 'components/forms/AddDueDateForm';
import AddTaskForm from 'components/forms/AddTaskForm';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { useSelector } from 'react-redux';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import { RootTabParamList } from 'types/base';
import { AnniversaryTaskResponseType } from 'types/tasks';

export default function EditTaskOccurrenceScreen({
  route,
  navigation
}: NativeStackScreenProps<RootTabParamList, 'EditTaskOccurrence'>) {
  const { taskId, recurrenceIndex } = route.params;
  const taskObj = useSelector(
    selectTaskById(taskId)
  ) as AnniversaryTaskResponseType;
  const scheduledTaskObj = useSelector(
    selectScheduledTask({ id: taskId, recurrenceIndex })
  );

  if (!(taskObj && scheduledTaskObj && taskObj.recurrence)) {
    return null;
  }

  if (taskObj.type === 'DUE_DATE') {
    return (
      <TransparentFullPageScrollView>
        <AddDueDateForm
          defaults={{
            ...taskObj,
            date: scheduledTaskObj.date as string
          }}
          onSuccess={() => navigation.goBack()}
          taskId={taskObj.id}
          recurrenceIndex={recurrenceIndex}
          recurrenceOverwrite={true}
        />
      </TransparentFullPageScrollView>
    );
  }

  if (['ANNIVERSARY', 'BIRTHDAY'].includes(taskObj.type)) {
    return (
      <TransparentFullPageScrollView>
        <AddAnniversaryForm
          defaults={{
            ...taskObj,
            date: taskObj.date as string
          }}
          onSuccess={() => navigation.goBack()}
          taskId={taskObj.id}
          recurrenceIndex={recurrenceIndex}
          recurrenceOverwrite={true}
        />
      </TransparentFullPageScrollView>
    );
  }

  if (taskObj.type === 'TASK' || taskObj.type === 'APPOINTMENT') {
    return (
      <TransparentFullPageScrollView>
        <AddTaskForm
          defaults={{
            ...taskObj,
            start_datetime: scheduledTaskObj.start_datetime
              ? new Date(scheduledTaskObj.start_datetime)
              : undefined,
            end_datetime: scheduledTaskObj.end_datetime
              ? new Date(scheduledTaskObj.end_datetime)
              : undefined,
            date: scheduledTaskObj.date,
            is_any_time: !!scheduledTaskObj.date
          }}
          onSuccess={() => navigation.goBack()}
          taskId={taskObj.id}
          recurrenceIndex={recurrenceIndex}
          recurrenceOverwrite={true}
          formType={taskObj.type}
        />
      </TransparentFullPageScrollView>
    );
  }

  return null;
}

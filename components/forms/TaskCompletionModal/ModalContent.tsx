import { useSelector } from 'react-redux';
import { useCreateTaskMutation } from 'reduxStore/services/api/tasks';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import { FieldValueTypes } from '../types';
import DueDateRescheduler from './DueDateRescheduler';
import FinalOccurrenceRescheduler from './FinalOccurrenceRescheduler';
import MOTTypeRescheduler from './MOTTypeRescheduler';

export default function ModalContent({
  taskId,
  recurrenceIndex,
  onDismiss,
  onSubmitSuccess
}: {
  taskId: number;
  recurrenceIndex?: number;
  onDismiss: () => void;
  onSubmitSuccess: () => void;
}) {
  const [createTask] = useCreateTaskMutation();
  const task = useSelector(selectTaskById(taskId));

  const scheduledTask = useSelector(
    selectScheduledTask({ id: taskId, recurrenceIndex })
  );
  const nextScheduledTask = useSelector(
    selectScheduledTask({
      id: taskId,
      recurrenceIndex: recurrenceIndex ? recurrenceIndex + 1 : undefined
    })
  );

  if (!task) {
    return null;
  }

  if (task?.type === 'DUE_DATE' && !task.recurrence) {
    return (
      <DueDateRescheduler
        onDismiss={onDismiss}
        onSubmitSuccess={onSubmitSuccess}
        taskId={taskId}
      />
    );
  }

  if (
    [
      'MOT_DUE',
      'INSURANCE_DUE',
      'SERVICE_DUE',
      'WARRANTY_DUE',
      'TAX_DUE'
    ].includes(task.hidden_tag)
  ) {
    return (
      <MOTTypeRescheduler
        onDismiss={onDismiss}
        onSubmitSuccess={onSubmitSuccess}
        taskId={taskId}
      />
    );
  }

  if (task?.recurrence && scheduledTask && !nextScheduledTask) {
    return (
      <FinalOccurrenceRescheduler
        onDismiss={onDismiss}
        onSubmitSuccess={onSubmitSuccess}
        taskId={taskId}
        recurrenceIndex={recurrenceIndex}
      />
    );
  }

  return null;
}

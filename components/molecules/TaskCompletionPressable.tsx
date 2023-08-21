import useCompletionCallback from 'components/forms/TaskCompletionModal/taskCompletionCallbacks';
import TaskCompletionModal from 'components/forms/TaskCompletionModal/TaskCompletionModal';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useCreateTaskActionCompletionFormMutation,
  useCreateTaskCompletionFormMutation
} from 'reduxStore/services/api/taskCompletionForms';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import SafePressable from './SafePressable';
import { TouchableOpacity } from './TouchableOpacityComponents';

export default function TaskCompletionPressable({
  taskId,
  recurrenceIndex,
  actionId,
  onSuccess = () => {},
  children,
  useSafePressable = false
}: {
  taskId: number;
  recurrenceIndex?: number;
  actionId: number | null;
  onSuccess?: () => void;
  children: ReactNode;
  useSafePressable?: boolean;
}) {
  const [showTaskCompletionForm, setShowTaskCompletionForm] = useState(false);
  const scheduledTask = useSelector(
    selectScheduledTask({ id: taskId, recurrenceIndex, actionId })
  );
  const taskObj = useSelector(selectTaskById(taskId));

  const [createTaskActionCompletionForm] =
    useCreateTaskActionCompletionFormMutation();
  const [triggerCreateCompletionForm] = useCreateTaskCompletionFormMutation();
  const completionCallback = useCompletionCallback(taskId, recurrenceIndex);

  if (!scheduledTask || !taskObj) {
    return null;
  }

  const PressableComp = useSafePressable ? SafePressable : TouchableOpacity;

  return (
    <>
      <PressableComp
        onPress={async () => {
          if (scheduledTask) {
            if (scheduledTask.action_id) {
              await createTaskActionCompletionForm({
                action: scheduledTask.action_id,
                recurrence_index: scheduledTask.recurrence_index
              }).unwrap();
              onSuccess();
              return;
            }
            await triggerCreateCompletionForm({
              resourcetype: 'TaskCompletionForm',
              recurrence_index: scheduledTask.recurrence_index,
              task: scheduledTask.id
            }).unwrap();

            if (completionCallback) {
              setShowTaskCompletionForm(true);
            } else {
              onSuccess();
            }
          }
        }}
      >
        {children}
      </PressableComp>
      {scheduledTask && taskObj && (
        <TaskCompletionModal
          taskId={taskId}
          recurrenceIndex={recurrenceIndex}
          onSubmitSuccess={() => {
            setShowTaskCompletionForm(false);
            onSuccess();
          }}
          onRequestClose={() => {
            setShowTaskCompletionForm(false);
          }}
          visible={showTaskCompletionForm}
        />
      )}
    </>
  );
}

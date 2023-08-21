import useCompletionCallback from 'components/forms/TaskCompletionForms/taskCompletionCallbacks';
import TaskCompletionForm from 'components/forms/TaskCompletionForms/TaskCompletionForm';
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
  recurrenceIndex: number | null;
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
  const { t } = useTranslation();
  const completionCallback = useCompletionCallback(taskId);

  console.log('completionCallback');
  console.log(completionCallback);

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
        <TaskCompletionForm
          taskId={taskId}
          title={t('components.task.scheduleNext', {
            dueDateType: taskObj.hidden_tag
              ? t(`hiddenTags.${taskObj.hidden_tag}`)
              : ''
          })}
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

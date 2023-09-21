import useCompletionCallback from 'components/forms/TaskCompletionModal/taskCompletionCallbacks';
import TaskCompletionModal from 'components/forms/TaskCompletionModal/TaskCompletionModal';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import {
  useCreateTaskActionCompletionFormMutation,
  useCreateTaskCompletionFormMutation,
  useDeleteTaskActionCompletionFormMutation,
  useDeleteTaskCompletionFormMutation
} from 'reduxStore/services/api/taskCompletionForms';
import {
  selectIsComplete,
  selectScheduledTask
} from 'reduxStore/slices/tasks/selectors';
import SafePressable from './SafePressable';
import { TouchableOpacity } from './TouchableOpacityComponents';

export default function TaskCompletionPressable({
  taskId,
  recurrenceIndex,
  actionId,
  onSuccess = () => {},
  onPress = () => {},
  children,
  useSafePressable = false,
  disabled
}: {
  taskId: number;
  recurrenceIndex?: number;
  actionId: number | null;
  onSuccess?: () => void;
  onPress?: () => void;
  children: ReactNode;
  useSafePressable?: boolean;
  disabled?: boolean;
}) {
  const [showTaskCompletionForm, setShowTaskCompletionForm] = useState(false);
  const scheduledTask = useSelector(
    selectScheduledTask({ id: taskId, recurrenceIndex, actionId })
  );
  const { isComplete, completionForm } = useSelector(
    selectIsComplete({
      id: taskId,
      recurrenceIndex: recurrenceIndex === undefined ? null : recurrenceIndex,
      actionId
    })
  );
  const { t } = useTranslation();

  const [createTaskActionCompletionForm, createTaskActionCompletionFormResult] =
    useCreateTaskActionCompletionFormMutation();
  const [triggerCreateCompletionForm, createTaskCompletionFormResult] =
    useCreateTaskCompletionFormMutation();
  const [deleteTaskCompletionForm, deleteTaskCompletionFormResult] =
    useDeleteTaskCompletionFormMutation();
  const [deleteTaskActionCompletionForm, deleteTaskActionCompletionFormResult] =
    useDeleteTaskActionCompletionFormMutation();
  const completionCallback = useCompletionCallback(taskId, recurrenceIndex);

  if (!scheduledTask) {
    return null;
  }

  const PressableComp = useSafePressable ? SafePressable : TouchableOpacity;

  return (
    <>
      <PressableComp
        onPress={() => {
          if (disabled) return;
          if (createTaskActionCompletionFormResult.isLoading) return;
          if (createTaskCompletionFormResult.isLoading) return;
          if (deleteTaskCompletionFormResult.isLoading) return;
          if (deleteTaskActionCompletionFormResult.isLoading) return;
          onPress();
          setTimeout(async () => {
            try {
              if (actionId) {
                if (isComplete && completionForm) {
                  await deleteTaskActionCompletionForm({
                    actionId,
                    formId: completionForm.id,
                    recurrenceIndex:
                      recurrenceIndex === undefined ? -1 : recurrenceIndex
                  }).unwrap();
                  onSuccess();
                  return;
                }
                await createTaskActionCompletionForm({
                  action: actionId,
                  recurrence_index:
                    recurrenceIndex === undefined ? -1 : recurrenceIndex
                }).unwrap();
                onSuccess();
                return;
              }
              if (isComplete && completionForm) {
                await deleteTaskCompletionForm({
                  taskId,
                  formId: completionForm.id,
                  recurrenceIndex:
                    recurrenceIndex === undefined ? -1 : recurrenceIndex
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
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }, 10);
        }}
      >
        {children}
      </PressableComp>
      {scheduledTask && (
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

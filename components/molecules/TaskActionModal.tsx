import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectTaskToAction } from 'reduxStore/slices/calendars/selectors';
import { RootTabParamList } from 'types/base';
import { LinkButton } from './ButtonComponents';
import { Modal } from 'components/molecules/Modals';

import {
  setTaskToAction,
  setTaskToPartiallyComplete,
  setTaskToReschedule
} from 'reduxStore/slices/calendars/actions';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';

import DeleteTaskModal from './DeleteTaskModal';
import { YesNoModal } from './Modals';
import { useDeleteTaskMutation } from 'reduxStore/services/api/tasks';
import TaskCompletionPressable from './TaskCompletionPressable';
import useCanMarkComplete from 'hooks/useCanMarkComplete';
import useHasEditPerms from 'hooks/useHasEditPerms';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBox: { paddingHorizontal: 30 }
});

export default function TaskActionModal() {
  const [deletingOccurrence, setDeletingOccurrence] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootTabParamList>>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deleteTask] = useDeleteTaskMutation();

  const taskToAction = useSelector(selectTaskToAction);
  const task = useSelector(selectTaskById(taskToAction?.taskId || -1));
  const scheduledTask = useSelector(
    selectScheduledTask(
      taskToAction
        ? {
            id: taskToAction.taskId,
            recurrenceIndex: taskToAction.recurrenceIndex,
            actionId: taskToAction.actionId
          }
        : { id: -1, recurrenceIndex: null, actionId: null }
    )
  );

  const canMarkComplete = useCanMarkComplete({
    taskId: task?.id || -1,
    recurrenceIndex: taskToAction?.recurrenceIndex,
    actionId: taskToAction?.actionId
  });

  const hasEditPerms = useHasEditPerms(task?.id || -1);

  return (
    <Modal
      visible={!!taskToAction}
      onRequestClose={() => {
        dispatch(setTaskToAction(null));
      }}
      boxStyle={styles.modalBox}
    >
      {hasEditPerms ? (
        task?.recurrence ? (
          <>
            <LinkButton
              onPress={() => {
                if (taskToAction) {
                  // We don't need to be able to edit specific instances
                  // of birthdays
                  if (['BIRTHDAY', 'ANNIVERSARY'].includes(task.type)) {
                    navigation.navigate('EditTask', {
                      taskId: taskToAction.taskId
                    });
                  } else {
                    navigation.navigate('EditTask', {
                      taskId: taskToAction.taskId,
                      recurrenceIndex:
                        taskToAction.recurrenceIndex === null
                          ? -1
                          : taskToAction.recurrenceIndex,
                      recurrenceOverwrite: true
                    });
                  }
                  dispatch(setTaskToAction(null));
                }
              }}
              title={t('components.task.editTask')}
            />
            <LinkButton
              onPress={() => {
                setDeletingOccurrence(true);
              }}
              title={t('common.delete')}
            />
          </>
        ) : (
          <>
            <LinkButton
              onPress={() => {
                if (taskToAction) {
                  navigation.navigate('EditTask', {
                    taskId: taskToAction.taskId
                  });
                  dispatch(setTaskToAction(null));
                }
              }}
              title={t('components.task.editTask')}
            />
            <LinkButton
              onPress={() => {
                setDeletingTask(true);
              }}
              title={t('common.delete')}
            />
          </>
        )
      ) : null}
      {taskToAction && (
        <LinkButton
          onPress={() => {
            if (taskToAction) {
              (navigation.navigate as any)('Chat', {
                screen: 'MessageThread',
                initial: false,
                params: taskToAction
              });
              dispatch(setTaskToAction(null));
            }
          }}
          title={t('components.task.messages')}
        />
      )}
      {canMarkComplete &&
        taskToAction &&
        scheduledTask &&
        !scheduledTask.is_complete && (
          <>
            <TaskCompletionPressable
              taskId={taskToAction.taskId}
              recurrenceIndex={
                taskToAction.recurrenceIndex === null
                  ? undefined
                  : taskToAction.recurrenceIndex
              }
              actionId={taskToAction.actionId}
              onPress={() => dispatch(setTaskToAction(null))}
            >
              <LinkButton
                onPress={() => {}}
                title={t('components.task.markComplete')}
                disabled={true}
              />
            </TaskCompletionPressable>
            {!taskToAction.actionId && (
              <LinkButton
                onPress={() => {
                  dispatch(setTaskToAction(null));
                  dispatch(
                    setTaskToPartiallyComplete({
                      taskId: taskToAction.taskId,
                      recurrenceIndex: taskToAction.recurrenceIndex,
                      actionId: taskToAction.actionId
                    })
                  );
                }}
                title={t('components.task.markPartiallyCompleteAndRepeat')}
              />
            )}
            {!taskToAction.actionId && (
              <LinkButton
                onPress={() => {
                  dispatch(setTaskToAction(null));
                  dispatch(
                    setTaskToReschedule({
                      taskId: taskToAction.taskId,
                      recurrenceIndex: taskToAction.recurrenceIndex,
                      actionId: taskToAction.actionId
                    })
                  );
                }}
                title={t('components.task.markIncompleteAndReschedule')}
              />
            )}
            {/* <TaskCompletionPressable
              taskId={taskToAction.taskId}
              recurrenceIndex={
                taskToAction.recurrenceIndex === null
                  ? undefined
                  : taskToAction.recurrenceIndex
              }
              actionId={taskToAction.actionId}
              onPress={() => dispatch(setTaskToAction(null))}
            >
              <LinkButton
                onPress={() => {}}
                title={t('components.task.markIncompleteAndReschedule')}
                disabled={true}
              />
            </TaskCompletionPressable> */}
          </>
        )}
      <DeleteTaskModal
        visible={deletingOccurrence}
        onRequestClose={() => setDeletingOccurrence(false)}
        recurrence={task?.recurrence?.id || -1}
        recurrenceIndex={
          taskToAction?.recurrenceIndex === null ||
          taskToAction?.recurrenceIndex === undefined
            ? -1
            : taskToAction?.recurrenceIndex
        }
        taskId={task?.id || -1}
      />
      <YesNoModal
        title={t('common.delete')}
        question={t('components.task.deleteConfirmation')}
        visible={deletingTask}
        onYes={() => {
          if (task?.id) {
            deleteTask({ id: task.id });
            setDeletingTask(false);
            dispatch(setTaskToAction(null));
          }
        }}
        onNo={() => {
          setDeletingTask(false);
        }}
      />
    </Modal>
  );
}

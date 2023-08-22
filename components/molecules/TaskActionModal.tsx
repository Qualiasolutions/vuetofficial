import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectTaskToAction } from 'reduxStore/slices/calendars/selectors';
import { RootTabParamList } from 'types/base';
import { LinkButton } from './ButtonComponents';
import Modal from 'react-native-modal';

import { setTaskToAction } from 'reduxStore/slices/calendars/actions';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';

import { WhiteBox } from './ViewComponents';
import DeleteTaskModal from './DeleteTaskModal';
import { YesNoModal } from './Modals';
import { useDeleteTaskMutation } from 'reduxStore/services/api/tasks';
import TaskCompletionPressable from './TaskCompletionPressable';
import useCanMarkComplete from 'hooks/useCanMarkComplete';
import useHasEditPerms from 'hooks/useHasEditPerms';

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
      isVisible={!!taskToAction}
      onDismiss={() => {
        dispatch(setTaskToAction(null));
      }}
      onBackdropPress={() => {
        dispatch(setTaskToAction(null));
      }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
    >
      <WhiteBox>
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
                      navigation.navigate('EditTaskOccurrence', {
                        taskId: taskToAction.taskId,
                        recurrenceIndex:
                          taskToAction.recurrenceIndex === null
                            ? -1
                            : taskToAction.recurrenceIndex
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
        {canMarkComplete && taskToAction && scheduledTask && (
          <TaskCompletionPressable
            taskId={taskToAction.taskId}
            recurrenceIndex={
              taskToAction.recurrenceIndex === null
                ? undefined
                : taskToAction.recurrenceIndex
            }
            actionId={taskToAction.actionId}
            onSuccess={() => dispatch(setTaskToAction(null))}
          >
            {scheduledTask.is_complete ? null : (
              <LinkButton
                onPress={() => {}}
                title={t('components.task.markComplete')}
                disabled={true}
              />
            )}
          </TaskCompletionPressable>
        )}
      </WhiteBox>
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

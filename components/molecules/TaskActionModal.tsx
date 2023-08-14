import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo, useState } from 'react';
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
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import {
  useCreateTaskActionCompletionFormMutation,
  useCreateTaskCompletionFormMutation
} from 'reduxStore/services/api/taskCompletionForms';
import TaskCompletionForm, {
  FORM_REQUIRED_TAGS
} from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import { useGetMemberEntitiesQuery } from 'reduxStore/services/api/entities';
import { WhiteBox } from './ViewComponents';
import DeleteTaskModal from './DeleteTaskModal';
import { YesNoModal } from './Modals';
import { useDeleteTaskMutation } from 'reduxStore/services/api/tasks';

export default function TaskActionModal() {
  const [showTaskCompletionForm, setShowTaskCompletionForm] = useState(false);
  const [deletingOccurrence, setDeletingOccurrence] = useState(false);
  const [deletingTask, setDeletingTask] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootTabParamList>>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: userDetails } = useGetUserFullDetails();

  // const currentUserId = useSelector(selectCurrentUserId);
  const { data: memberEntities } = useGetMemberEntitiesQuery(null as any);

  const [triggerCreateCompletionForm] = useCreateTaskCompletionFormMutation();
  const [createTaskActionCompletionForm] =
    useCreateTaskActionCompletionFormMutation();

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

  const hasEditPerms = useMemo(() => {
    if (userDetails && task?.members.includes(userDetails.id)) {
      return true;
    }
    if (memberEntities) {
      if (task?.entities.some((entityId) => entityId in memberEntities.byId)) {
        return true;
      }
    }
    return false;
  }, [memberEntities, userDetails, task]);

  const showCheckbox =
    userDetails?.is_premium &&
    hasEditPerms &&
    taskToAction &&
    task &&
    ['TASK', 'APPOINTMENT', 'DUE_DATE'].includes(task.type);

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
        {showCheckbox && scheduledTask && !scheduledTask.is_complete && (
          <LinkButton
            onPress={async () => {
              if (taskToAction) {
                if (taskToAction.actionId) {
                  await createTaskActionCompletionForm({
                    action: taskToAction.actionId,
                    recurrence_index: taskToAction.recurrenceIndex
                  }).unwrap();
                  dispatch(setTaskToAction(null));
                  return;
                }
                await triggerCreateCompletionForm({
                  resourcetype: 'TaskCompletionForm',
                  recurrence_index: taskToAction.recurrenceIndex,
                  task: task.id
                }).unwrap();

                if (FORM_REQUIRED_TAGS.includes(task.hidden_tag)) {
                  setShowTaskCompletionForm(true);
                } else {
                  dispatch(setTaskToAction(null));
                }
              }
            }}
            title={t('components.task.markComplete')}
          />
        )}
        {task && taskToAction && (
          <TaskCompletionForm
            taskId={taskToAction.taskId}
            title={t('components.task.scheduleNext', {
              dueDateType: task.hidden_tag
                ? t(`hiddenTags.${task.hidden_tag}`)
                : ''
            })}
            onSubmitSuccess={() => {
              setShowTaskCompletionForm(false);
            }}
            onRequestClose={() => {
              setShowTaskCompletionForm(false);
            }}
            visible={showTaskCompletionForm}
          />
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

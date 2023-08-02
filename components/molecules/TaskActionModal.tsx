import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectTaskToAction } from 'reduxStore/slices/calendars/selectors';
import { RootTabParamList } from 'types/base';
import { LinkButton } from './ButtonComponents';
import { YesNoModal } from './Modals';
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
import { useCreateRecurrentTaskOverwriteMutation } from 'reduxStore/services/api/tasks';
import { useGetMemberEntitiesQuery } from 'reduxStore/services/api/entities';
import { WhiteBox } from './ViewComponents';

export default function TaskActionModal() {
  const [showTaskCompletionForm, setShowTaskCompletionForm] = useState(false);
  const [deletingOccurrence, setDeletingOccurrence] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootTabParamList>>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: userDetails } = useGetUserFullDetails();

  // const currentUserId = useSelector(selectCurrentUserId);
  const { data: memberEntities } = useGetMemberEntitiesQuery(null as any);

  const [triggerCreateCompletionForm] = useCreateTaskCompletionFormMutation();
  const [createTaskActionCompletionForm] =
    useCreateTaskActionCompletionFormMutation();

  const [createRecurrentTaskOverwrite] =
    useCreateRecurrentTaskOverwriteMutation();

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
                    navigation.navigate('EditTaskOccurrence', {
                      taskId: taskToAction.taskId,
                      recurrenceIndex: taskToAction.recurrenceIndex || -1
                    });
                    dispatch(setTaskToAction(null));
                  }
                }}
                title={t('components.task.editOccurrence')}
              />
              <LinkButton
                onPress={() => {
                  setDeletingOccurrence(true);
                }}
                title={t('components.task.deleteOccurrence')}
              />
              <LinkButton
                onPress={() => {
                  if (taskToAction) {
                    navigation.navigate('EditTask', {
                      taskId: taskToAction.taskId
                    });
                    dispatch(setTaskToAction(null));
                  }
                }}
                title={t('components.task.editAll')}
              />
            </>
          ) : (
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
      <YesNoModal
        title={t('components.task.deleteOccurrence')}
        question={t('components.task.deleteOccurrenceConfirmation')}
        visible={deletingOccurrence}
        onYes={() => {
          if (
            task?.recurrence?.id &&
            taskToAction &&
            taskToAction.recurrenceIndex !== null
          ) {
            createRecurrentTaskOverwrite({
              task: null,
              recurrence_index: taskToAction.recurrenceIndex,
              recurrence: task.recurrence.id,
              baseTaskId: task.id
            });
          }
        }}
        onNo={() => {
          setDeletingOccurrence(false);
        }}
      />
    </Modal>
  );
}

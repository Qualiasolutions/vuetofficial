import { useNavigation } from '@react-navigation/native';
import { SmallButton } from 'components/molecules/ButtonComponents';
import ElevatedPressableBox from 'components/molecules/ElevatedPressableBox';
import EntityTags from 'components/molecules/EntityTags';
import OptionTags from 'components/molecules/OptionTags';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import {
  useDeleteActionAlertMutation,
  useDeleteAlertMutation,
  useGetAllActionAlertsQuery,
  useGetAllAlertsQuery,
  useMarkAlertsReadMutation
} from 'reduxStore/services/api/alerts';
import {
  useCreateTaskActionCompletionFormMutation,
  useCreateTaskCompletionFormMutation
} from 'reduxStore/services/api/taskCompletionForms';
import {
  selectActionAlertById,
  selectAlertById,
  selectAlertsByActionId,
  selectAlertsByTaskId,
  selectHasUnreadAlert
} from 'reduxStore/slices/alerts/selectors';
import {
  selectScheduledTask,
  selectTaskActionById
} from 'reduxStore/slices/tasks/selectors';
import {
  selectOverdueTasks,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import {
  selectCurrentUserId,
  selectFamilyMemberFromId
} from 'reduxStore/slices/users/selectors';
import { ScheduledTaskResponseType } from 'types/tasks';

const alertEntryStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ignoreButtonText: { fontSize: 24, color: 'red', marginLeft: 20 }
});
const AlertEntry = ({ alertId }: { alertId: number }) => {
  const alert = useSelector(selectAlertById(alertId));
  const currentUserId = useSelector(selectCurrentUserId);
  const user = useSelector(
    selectFamilyMemberFromId(currentUserId || -1, alert?.user || -1)
  );
  const { t } = useTranslation();
  const [deleteAlert] = useDeleteAlertMutation();

  if (!alert) {
    return null;
  }

  return (
    <TransparentView style={alertEntryStyles.container}>
      <TransparentView>
        <Text>
          {alert.type} for{' '}
          {currentUserId === user?.id
            ? 'you'
            : `${user?.first_name} ${user?.last_name}`}
        </Text>
      </TransparentView>
      <Pressable
        onPress={async () => {
          try {
            await deleteAlert({ id: alertId, task: alert.task }).unwrap();
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: t('common.errors.generic')
            });
          }
        }}
      >
        {currentUserId === user?.id && (
          <Text style={alertEntryStyles.ignoreButtonText}>X</Text>
        )}
      </Pressable>
    </TransparentView>
  );
};

const ActionAlertEntry = ({ actionAlertId }: { actionAlertId: number }) => {
  const alert = useSelector(selectActionAlertById(actionAlertId));
  const currentUserId = useSelector(selectCurrentUserId);
  const user = useSelector(
    selectFamilyMemberFromId(currentUserId || -1, alert?.user || -1)
  );
  const { t } = useTranslation();
  const [deleteAlert] = useDeleteActionAlertMutation();

  if (!alert) {
    return null;
  }

  return (
    <TransparentView style={alertEntryStyles.container}>
      <TransparentView>
        <Text>
          {alert.type} for{' '}
          {currentUserId === user?.id
            ? 'you'
            : `${user?.first_name} ${user?.last_name}`}
        </Text>
      </TransparentView>
      <Pressable
        onPress={async () => {
          try {
            await deleteAlert({
              id: actionAlertId,
              action: alert.action
            }).unwrap();
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: t('common.errors.generic')
            });
          }
        }}
      >
        {currentUserId === user?.id && (
          <Text style={alertEntryStyles.ignoreButtonText}>X</Text>
        )}
      </Pressable>
    </TransparentView>
  );
};

const taskAlertStyles = StyleSheet.create({
  card: { marginBottom: 10 },
  tagsWrapper: {
    flexDirection: 'row',
    width: '50%',
    flex: 0
  }
});
const TaskAlerts = ({ taskId }: { taskId: number | null }) => {
  const task = useSelector(selectTaskById(taskId || -1));
  const alerts = useSelector(selectAlertsByTaskId(taskId || -1));

  const navigation = useNavigation();

  if (!task || alerts.length === 0) {
    return null;
  }

  const alertList = alerts.map((alertId) => (
    <AlertEntry alertId={alertId} key={alertId} />
  ));

  return (
    <ElevatedPressableBox
      style={taskAlertStyles.card}
      onPress={() => (navigation.navigate as any)('EditTask', { taskId })}
    >
      <Text>{task.title}</Text>
      <Text>
        {task.date || `${task.start_datetime} - ${task.end_datetime}`}
      </Text>
      <TransparentScrollView style={taskAlertStyles.tagsWrapper} horizontal>
        <EntityTags entities={task.entities} />
        <OptionTags tagNames={task.tags} />
      </TransparentScrollView>
      {alertList}
    </ElevatedPressableBox>
  );
};

const TaskActionAlerts = ({ actionId }: { actionId: number }) => {
  const action = useSelector(selectTaskActionById(actionId));
  const actionAlerts = useSelector(selectAlertsByActionId(actionId));
  const task = useSelector(selectTaskById(action?.task || -1));
  const scheduledAction = useSelector(selectScheduledTask({ actionId }));

  const navigation = useNavigation();

  if (!action || !task || !scheduledAction || actionAlerts.length === 0) {
    return null;
  }

  const alertList = actionAlerts.map((actionAlertId) => (
    <ActionAlertEntry actionAlertId={actionAlertId} key={actionAlertId} />
  ));

  return (
    <ElevatedPressableBox
      style={taskAlertStyles.card}
      onPress={() =>
        (navigation.navigate as any)('EditTask', { taskId: task.id })
      }
    >
      <Text>{`ACTION - ${task.title}`}</Text>
      <TransparentScrollView style={taskAlertStyles.tagsWrapper} horizontal>
        <EntityTags entities={task.entities} />
        <OptionTags tagNames={task.tags} />
      </TransparentScrollView>
      <Text>
        {scheduledAction.date ||
          `${scheduledAction.start_datetime} - ${scheduledAction.end_datetime}`}
      </Text>
      {alertList}
    </ElevatedPressableBox>
  );
};

const overdueTaskStyles = StyleSheet.create({
  buttons: {
    flexDirection: 'row'
  },
  button: {
    margin: 10
  }
});
const OverdueTask = ({
  task,
  action,
  recurrenceIndex
}: {
  task: number;
  action: number | null;
  recurrenceIndex: number;
}) => {
  const taskObj = useSelector(
    selectScheduledTask({ id: task, recurrenceIndex, actionId: action })
  );
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [triggerCreateCompletionForm] = useCreateTaskCompletionFormMutation();
  const [createTaskActionCompletionForm] =
    useCreateTaskActionCompletionFormMutation();

  if (!taskObj) {
    return null;
  }

  return (
    <ElevatedPressableBox
      style={taskAlertStyles.card}
      onPress={() => (navigation.navigate as any)('EditTask', { taskId: task })}
    >
      <Text>{taskObj.title}</Text>
      <Text>
        {taskObj.date || `${taskObj.start_datetime} - ${taskObj.end_datetime}`}
      </Text>
      <TransparentScrollView style={taskAlertStyles.tagsWrapper} horizontal>
        <EntityTags entities={taskObj.entities} />
        <OptionTags tagNames={taskObj.tags} />
      </TransparentScrollView>
      <TransparentView style={overdueTaskStyles.buttons}>
        <SmallButton
          title={t('common.markDone')}
          onPress={async () => {
            try {
              if (action) {
                await createTaskActionCompletionForm({
                  action,
                  recurrence_index: recurrenceIndex
                });
              } else {
                await triggerCreateCompletionForm({
                  resourcetype: 'TaskCompletionForm',
                  recurrence_index: recurrenceIndex,
                  task
                }).unwrap();
              }
            } catch (err) {
              console.error(err);
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }}
          style={overdueTaskStyles.button}
        />
        <SmallButton
          title={t('common.ignore')}
          onPress={async () => {
            try {
              if (action) {
                await createTaskActionCompletionForm({
                  action,
                  recurrence_index: recurrenceIndex,
                  ignore: true
                });
              } else {
                await triggerCreateCompletionForm({
                  resourcetype: 'TaskCompletionForm',
                  recurrence_index: recurrenceIndex,
                  ignore: true,
                  task
                }).unwrap();
              }
            } catch (err) {
              console.error(err);
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }}
          style={overdueTaskStyles.button}
        />
      </TransparentView>
    </ElevatedPressableBox>
  );
};

const listStyles = StyleSheet.create({
  container: { height: '100%', width: '100%' },
  scrollView: { padding: 10 },
  listView: { paddingBottom: 250 }
});

export default function AlertsList() {
  const { t } = useTranslation();
  const { data: allAlerts, isLoading: isLoadingAlerts } =
    useGetAllAlertsQuery();

  const { data: allActionAlerts, isLoading: isLoadingActionAlerts } =
    useGetAllActionAlertsQuery();

  const { data: userDetails } = useGetUserFullDetails();

  const [markAlertsRead] = useMarkAlertsReadMutation();

  const hasUnreadAlert = useSelector(selectHasUnreadAlert);

  useEffect(() => {
    if (userDetails && hasUnreadAlert) {
      markAlertsRead(userDetails.id);
    }
  }, [hasUnreadAlert, userDetails, markAlertsRead]);

  // const overdueTasks = useSelector(selectOverdueTasks);

  if (
    isLoadingAlerts ||
    !allAlerts ||
    isLoadingActionAlerts ||
    !allActionAlerts
  ) {
    return <FullPageSpinner />;
  }

  const alertedTasks = Object.keys(allAlerts.byTask).map((tsk) =>
    parseInt(tsk)
  );

  const alertedActions = Object.keys(allActionAlerts.byAction).map((action) =>
    parseInt(action)
  );

  if (
    alertedTasks.length === 0 &&
    alertedActions.length === 0
    // overdueTasks.length === 0
  ) {
    return (
      <TransparentPaddedView>
        <Text>{t('components.alertsList.noAlerts')}</Text>
      </TransparentPaddedView>
    );
  }

  const isAlert = (
    item:
      | {
          task?: number;
          action?: number;
          type: string;
        }
      | {
          task: ScheduledTaskResponseType;
          type: string;
        }
  ): item is {
    task: number;
    action: number;
    type: string;
  } => {
    return item.type === 'ALERT';
  };

  const isActionAlert = (
    item:
      | {
          task?: number;
          action?: number;
          type: string;
        }
      | {
          task: ScheduledTaskResponseType;
          type: string;
        }
  ): item is {
    task: number;
    action: number;
    type: string;
  } => {
    return item.type === 'ACTION_ALERT';
  };

  const isOverdueTask = (
    item:
      | {
          task?: number;
          action?: number;
          type: string;
        }
      | {
          task: ScheduledTaskResponseType;
          type: string;
        }
  ): item is {
    task: ScheduledTaskResponseType;
    type: string;
  } => {
    return item.type === 'OVERDUE_TASK';
  };

  return (
    <TransparentView style={listStyles.container}>
      <FlatList
        data={[
          ...alertedTasks.map((task) => ({ task, type: 'ALERT' })),
          ...alertedActions.map((action) => ({ action, type: 'ACTION_ALERT' }))
          // ...overdueTasks.map((task) => ({ task, type: 'OVERDUE_TASK' }))
        ]}
        contentContainerStyle={listStyles.listView}
        renderItem={({ item }) => {
          if (isAlert(item)) {
            return (
              <TaskAlerts taskId={item.task} key={item.task || item.action} />
            );
          } else if (isActionAlert(item)) {
            return (
              <TaskActionAlerts
                actionId={item.action}
                key={item.task || item.action}
              />
            );
          } else if (isOverdueTask(item)) {
            return (
              <OverdueTask
                key={`${item.task.id}_${item.task.recurrence_index}_${item.task.action_id}`}
                task={item.task.id}
                action={item.task.action_id}
                recurrenceIndex={
                  item.task.recurrence_index === null
                    ? -1
                    : item.task.recurrence_index
                }
              />
            );
          }

          return null;
        }}
        style={listStyles.scrollView}
      />
    </TransparentView>
  );
}

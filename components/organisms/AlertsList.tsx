import { useNavigation } from '@react-navigation/native';
import { Button } from 'components/molecules/ButtonComponents';
import ElevatedPressableBox from 'components/molecules/ElevatedPressableBox';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import {
  useDeleteAlertMutation,
  useGetAllAlertsQuery
} from 'reduxStore/services/api/alerts';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';
import {
  selectAlertById,
  selectAlertsByTaskId
} from 'reduxStore/slices/alerts/selectors';
import { selectScheduledTask } from 'reduxStore/slices/calendars/selectors';
import {
  selectOverdueTasks,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import {
  selectCurrentUserId,
  selectFamilyMemberFromId
} from 'reduxStore/slices/users/selectors';

const alertEntryStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
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

const taskAlertStyles = StyleSheet.create({
  card: { marginBottom: 10 }
});
const TaskAlerts = ({ taskId }: { taskId: number }) => {
  const task = useSelector(selectTaskById(taskId));
  const alerts = useSelector(selectAlertsByTaskId(taskId));
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
        {task.start_datetime} - {task.end_datetime}
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
  recurrenceIndex
}: {
  task: number;
  recurrenceIndex: number;
}) => {
  const taskObj = useSelector(
    selectScheduledTask({ id: task, recurrenceIndex })
  );
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

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
      <TransparentView style={overdueTaskStyles.buttons}>
        <Button
          title={t('common.markDone')}
          onPress={async () => {
            try {
              await triggerCreateCompletionForm({
                resourcetype: 'TaskCompletionForm',
                recurrence_index: recurrenceIndex,
                task
              }).unwrap();
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
        <Button
          title={t('common.ignore')}
          onPress={async () => {
            try {
              await triggerCreateCompletionForm({
                resourcetype: 'TaskCompletionForm',
                recurrence_index: recurrenceIndex,
                ignore: true,
                task
              }).unwrap();
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
  container: { paddingBottom: 300 }
});

export default function AlertsList() {
  const { t } = useTranslation();
  const { data: allAlerts, isLoading: isLoadingAlerts } =
    useGetAllAlertsQuery();

  const overdueTasks = useSelector(selectOverdueTasks);

  if (isLoadingAlerts || !allAlerts) {
    return <FullPageSpinner />;
  }

  const alertedTasks = Object.keys(allAlerts.byTask).map((tsk) =>
    parseInt(tsk)
  );

  if (alertedTasks.length === 0) {
    return (
      <TransparentPaddedView>
        <Text>{t('components.alertsList.noAlerts')}</Text>
      </TransparentPaddedView>
    );
  }

  const overdueTaskViews = overdueTasks.map((scheduledTask) => (
    <OverdueTask
      task={scheduledTask.id}
      recurrenceIndex={
        scheduledTask.recurrence_index === null
          ? -1
          : scheduledTask.recurrence_index
      }
    />
  ));

  const taskAlerts = alertedTasks.map((task) => (
    <TaskAlerts taskId={task} key={task} />
  ));

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView style={listStyles.container}>
        <Text>ALERTS</Text>
        {taskAlerts}
        <Text>OVERDUE TASKS</Text>
        {overdueTaskViews}
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}

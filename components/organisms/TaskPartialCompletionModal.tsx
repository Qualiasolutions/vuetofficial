import DateTimeTextInput from 'components/forms/components/DateTimeTextInput';
import { LinkButton, SmallButton } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCreateTaskMutation,
  useCreateTaskWithoutCacheInvalidationMutation
} from 'reduxStore/services/api/tasks';
import { setTaskToPartiallyComplete } from 'reduxStore/slices/calendars/actions';
import { selectTaskToPartiallyComplete } from 'reduxStore/slices/calendars/selectors';
import { selectScheduledTask } from 'reduxStore/slices/tasks/selectors';
import { CreateTaskRequest } from 'types/tasks';

const styles = StyleSheet.create({
  specificTimeSection: { marginTop: 20 },
  submitButton: { marginTop: 6 }
});

export default function TaskPartialCompletionModal() {
  const taskToPartiallyComplete = useSelector(selectTaskToPartiallyComplete);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const scheduledTask = useSelector(
    selectScheduledTask({
      id: taskToPartiallyComplete?.taskId,
      recurrenceIndex: taskToPartiallyComplete?.recurrenceIndex
    })
  );
  const [newTaskTime, setNewTaskTime] = useState<Date | null>(null);
  const [createTask, createTaskResult] =
    useCreateTaskWithoutCacheInvalidationMutation();

  useEffect(() => {
    const scheduledTaskStart =
      scheduledTask?.start_date ||
      scheduledTask?.start_datetime ||
      scheduledTask?.date;
    setNewTaskTime(scheduledTaskStart ? new Date(scheduledTaskStart) : null);
  }, [scheduledTask]);

  const createDuplicateTask = useCallback(
    async (daysOffset: number) => {
      if (scheduledTask) {
        const newTaskCreateBody: CreateTaskRequest = {
          title: scheduledTask.title,
          members: scheduledTask.members,
          entities: scheduledTask.entities,
          resourcetype: 'FixedTask'
        };
        if (scheduledTask.start_datetime && scheduledTask.end_datetime) {
          const startDatetime = new Date(scheduledTask.start_datetime);
          startDatetime.setDate(startDatetime.getDate() + daysOffset);
          newTaskCreateBody.start_datetime =
            dayjs(startDatetime).format('YYYY-MM-DDTHH:mm:ss') + 'Z';

          const endDatetime = new Date(scheduledTask.end_datetime);
          endDatetime.setDate(endDatetime.getDate() + daysOffset);
          newTaskCreateBody.end_datetime =
            dayjs(endDatetime).format('YYYY-MM-DDTHH:mm:ss') + 'Z';
        }
        if (scheduledTask.start_date && scheduledTask.end_date) {
          const startDate = new Date(scheduledTask.start_date);
          startDate.setDate(startDate.getDate() + daysOffset);
          newTaskCreateBody.start_date = dayjs(startDate).format('YYYY-MM-DD');

          const endDate = new Date(scheduledTask.end_date);
          endDate.setDate(endDate.getDate() + daysOffset);
          newTaskCreateBody.end_date = dayjs(endDate).format('YYYY-MM-DD');
        }
        if (scheduledTask.date && scheduledTask.duration) {
          const newDate = new Date(scheduledTask.date);
          newDate.setDate(newDate.getDate() + daysOffset);
          newTaskCreateBody.date = dayjs(newDate).format('YYYY-MM-DD');
          newTaskCreateBody.duration = scheduledTask.duration;
        }

        try {
          dispatch(setTaskToPartiallyComplete(null));
          await createTask(newTaskCreateBody).unwrap();
        } catch {
          Toast.show({
            type: 'error',
            text1: t('common.errors.generic')
          });
        }
      }
    },
    [scheduledTask, createTask, dispatch, t]
  );

  return (
    <Modal
      visible={!!taskToPartiallyComplete}
      onRequestClose={() => {
        dispatch(setTaskToPartiallyComplete(null));
      }}
    >
      <TransparentView>
        <LinkButton
          title={t('components.taskPartialCompletionModal.rescheduleOneDay')}
          disabled={createTaskResult.isLoading}
          onPress={() => {
            createDuplicateTask(1);
          }}
        />
        <LinkButton
          title={t('components.taskPartialCompletionModal.rescheduleOneWeek')}
          onPress={() => {
            createDuplicateTask(7);
          }}
        />

        {/* <TransparentView style={styles.specificTimeSection}>
          <Text>{t('components.taskPartialCompletionModal.rescheduleOn')}</Text>
          <DateTimeTextInput
            value={newTaskTime}
            onValueChange={setNewTaskTime}
            mode={scheduledTask?.start_datetime ? 'datetime' : 'date'}
          />
          <SmallButton
            title={t('common.submit')}
            onPress={() => {}}
            disabled={!newTaskTime}
            style={styles.submitButton}
          />
        </TransparentView> */}
      </TransparentView>
    </Modal>
  );
}

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { useFieldTypesForFormType } from 'components/forms/taskFormFieldTypes';
import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import useGetUserDetails from 'hooks/useGetUserDetails';
import useEntityHeader from 'headers/hooks/useEntityHeader';
import {
  isAccommodationTaskType,
  isActivityTaskType,
  isAnniversaryTaskType,
  isTransportTaskType
} from 'constants/TaskTypes';
import { getTimeInTimezone } from 'utils/datesAndTimes';
import GenericAddTaskForm from 'components/forms/GenericAddTaskForm';
import { useSelector } from 'react-redux';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  }
});

export default function EditTaskScreen({
  route,
  navigation
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const { t } = useTranslation();

  const { taskId, recurrenceIndex } = route.params;

  const { data: userDetails } = useGetUserDetails();
  const taskObj = useSelector(selectTaskById(taskId));
  const scheduledTaskObj = useSelector(
    selectScheduledTask({
      id: taskId,
      recurrenceIndex
    })
  );

  const formType = useMemo(() => {
    const taskType = taskObj?.type;
    if (!taskType) {
      return null;
    }
    if (isTransportTaskType(taskType)) {
      return 'TRANSPORT';
    }
    if (isAccommodationTaskType(taskType)) {
      return 'ACCOMMODATION';
    }
    if (isAnniversaryTaskType(taskType)) {
      return 'ANNIVERSARY';
    }
    if (isActivityTaskType(taskType)) {
      return 'ACTIVITY';
    }
    return taskType;
  }, [taskObj]);

  const taskToEditType = taskObj?.type;
  const taskFields = useFieldTypesForFormType(formType, {
    isEdit: true,
    allowRecurrence: true,
    taskHiddenTag: taskObj?.hidden_tag,
    disableFlexible: true,
    disabledRecurrenceFields: !!(taskObj && taskObj?.recurrence),
    anniversaryType:
      taskToEditType && isAnniversaryTaskType(taskToEditType)
        ? taskToEditType
        : undefined,
    transportType:
      taskToEditType && isTransportTaskType(taskToEditType)
        ? taskToEditType
        : undefined,
    accommodationType:
      taskToEditType && isAccommodationTaskType(taskToEditType)
        ? taskToEditType
        : undefined
  });

  const defaultValues = useMemo(() => {
    if (taskObj && scheduledTaskObj && userDetails) {
      if (taskObj.start_timezone && taskObj.start_datetime) {
        const newStart = getTimeInTimezone(
          taskObj.start_datetime,
          taskObj.start_timezone
        );

        taskObj.start_datetime = newStart;
      }
      if (taskObj.end_timezone && taskObj.end_datetime) {
        const newEnd = getTimeInTimezone(
          taskObj.end_datetime,
          taskObj.end_timezone
        );
        taskObj.end_datetime = newEnd;
      }

      if (scheduledTaskObj.start_date) {
        scheduledTaskObj.date = scheduledTaskObj.start_date;
      }

      const newTaskToEdit = {
        ...taskObj,
        date: (recurrenceIndex
          ? scheduledTaskObj.date
          : taskObj.date) as string,
        start_datetime: scheduledTaskObj.start_datetime
          ? new Date(scheduledTaskObj.start_datetime)
          : undefined,
        end_datetime: scheduledTaskObj.end_datetime
          ? new Date(scheduledTaskObj.end_datetime)
          : undefined,
        is_any_time: !!scheduledTaskObj.date,
        tagsAndEntities: {
          entities: taskObj.entities,
          tags: taskObj.tags || []
        }
      };

      const initialTaskFields = createInitialObject(
        taskFields,
        userDetails,
        newTaskToEdit
      );
      return initialTaskFields;
    }
  }, [taskObj, scheduledTaskObj, userDetails, taskFields, recurrenceIndex]);

  useEntityHeader(0, false, t('pageTitles.editTask'));

  if (!(defaultValues && Object.keys(defaultValues).length > 0)) {
    return <FullPageSpinner />;
  }

  if (!taskToEditType) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        <GenericAddTaskForm
          type={taskToEditType}
          isEdit={true}
          defaults={defaultValues}
          taskId={route.params.taskId}
          recurrenceIndex={route.params.recurrenceIndex}
          recurrenceOverwrite={route.params.recurrenceOverwrite}
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}

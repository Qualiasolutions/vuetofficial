import AddAnniversaryForm from 'components/forms/AddAnniversaryForm';
import AddDueDateForm from 'components/forms/AddDueDateForm';
import AddTaskForm from 'components/forms/AddTaskForm';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  isAccommodationTaskType,
  isAnniversaryTaskType,
  isTransportTaskType
} from 'constants/TaskTypes';
import { ViewStyle } from 'react-native';
import { TaskType } from 'types/tasks';
import AddAccommodationTaskForm from './AddAccommodationTaskForm';
import AddHolidayTaskForm from './AddHolidayTaskForm';
import AddTransportTaskForm from './AddTransportTaskForm';

export default function GenericAddTaskForm({
  type,
  defaults,
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  taskId,
  inlineFields,
  sectionStyle
}: {
  type: TaskType;
  defaults: any;
  onSuccess: () => void;
  recurrenceOverwrite?: boolean;
  recurrenceIndex?: number;
  taskId?: number;
  inlineFields?: boolean;
  sectionStyle?: ViewStyle;
}) {
  /*
    GenericAddTaskForm

    Use recurrenceOverwrite, recurrenceIndex and taskId to use this
    to overwrite a recurrent task (either the instance or the series)

    Otherwise this is just a standard AddTask form
  */

  const genericProps = {
    defaults,
    onSuccess,
    taskId,
    recurrenceIndex,
    recurrenceOverwrite,
    inlineFields,
    sectionStyle
  };

  if (type === 'DUE_DATE') {
    return (
      <TransparentFullPageScrollView>
        <AddDueDateForm {...genericProps} />
      </TransparentFullPageScrollView>
    );
  }

  if (type === 'TASK' || type === 'APPOINTMENT') {
    return (
      <TransparentFullPageScrollView>
        <AddTaskForm {...genericProps} formType={type} />
      </TransparentFullPageScrollView>
    );
  }

  if (type === 'HOLIDAY') {
    return (
      <TransparentFullPageScrollView>
        <AddHolidayTaskForm {...genericProps} />
      </TransparentFullPageScrollView>
    );
  }

  if (isAnniversaryTaskType(type)) {
    return (
      <TransparentFullPageScrollView>
        <AddAnniversaryForm {...genericProps} />
      </TransparentFullPageScrollView>
    );
  }

  if (isAccommodationTaskType(type)) {
    return (
      <TransparentFullPageScrollView>
        <AddAccommodationTaskForm {...genericProps} />
      </TransparentFullPageScrollView>
    );
  }

  if (isTransportTaskType(type)) {
    return (
      <TransparentFullPageScrollView>
        <AddTransportTaskForm {...genericProps} />
      </TransparentFullPageScrollView>
    );
  }

  return null;
}

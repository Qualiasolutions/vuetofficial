import { useThemeColor } from 'components/Themed';

import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import RadioInput from 'components/forms/components/RadioInput';
import useGetUserDetails from 'hooks/useGetUserDetails';
import useColouredHeader from 'headers/hooks/useColouredHeader';
import dayjs from 'dayjs';
import { RootTabScreenProps } from 'types/base';
import AddDueDateForm from 'components/forms/AddDueDateForm';
import AddTaskForm from 'components/forms/AddTaskForm';
import { TaskType } from 'types/tasks';
import AddTransportTaskForm from 'components/forms/AddTransportTaskForm';

const formTypes = [
  {
    value: {
      id: 'TASK'
    },
    label: 'Task'
  },
  {
    value: {
      id: 'APPOINTMENT'
    },
    label: 'Appointment'
  },
  {
    value: {
      id: 'DUE_DATE'
    },
    label: 'Due Date'
  },
  {
    value: {
      id: 'TRANSPORT'
    },
    label: 'Transport'
  }
];

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  typeSelector: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginBottom: 20
  },
  hidden: { display: 'none' }
});

type AddTaskScreenProps = RootTabScreenProps<'AddTask'>;

export default function AddTaskScreen({
  route,
  navigation
}: AddTaskScreenProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();
  const [formType, setFormType] = useState<TaskType>(
    route.params?.type || 'TASK'
  );

  const headerBackgroundColor = useThemeColor({}, 'secondary');
  const headerTintColor = useThemeColor({}, 'white');
  const headerTitle = {
    TASK: 'Add task',
    APPOINTMENT: 'Add Appointment',
    DUE_DATE: 'Add Due Date',
    TRANSPORT: 'Add Flight'
  }[formType];

  useColouredHeader(headerBackgroundColor, headerTintColor, headerTitle);

  useEffect(() => {
    setFormType(route.params?.type || 'TASK');
  }, [route]);

  const taskDefaults = useMemo(() => {
    const currentTime = new Date();
    const defaultStartTime = new Date(currentTime);
    defaultStartTime.setMinutes(0);
    defaultStartTime.setSeconds(0);
    defaultStartTime.setMilliseconds(0);
    defaultStartTime.setHours(defaultStartTime.getHours() + 1);

    const defaultEndTime = new Date(defaultStartTime);

    if (formType === 'TASK') {
      defaultEndTime.setMinutes(defaultStartTime.getMinutes() + 15);
    }
    if (formType === 'APPOINTMENT') {
      defaultEndTime.setHours(defaultStartTime.getHours() + 1);
    }

    const defaultDuration = 15;
    const defaultEarliestActionDate = dayjs(new Date()).format('YYYY-MM-DD');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDueDate = dayjs(nextWeek).format('YYYY-MM-DD');

    return {
      title: route.params?.title || '',
      start_datetime: defaultStartTime,
      end_datetime: defaultEndTime,
      date: defaultDueDate,
      duration: defaultDuration,
      recurrence: null,
      earliest_action_date: defaultEarliestActionDate,
      due_date: defaultDueDate,
      entities: route.params?.entities || [],
      tags: route.params?.tags || []
    };
  }, [formType, route.params]);

  const dueDateDefaults = useMemo(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDueDate =
      route.params?.date || dayjs(nextWeek).format('YYYY-MM-DD');

    return {
      date: defaultDueDate,
      title: route.params?.title || '',
      duration: 15,
      entities: route.params?.entities || [],
      tags: route.params?.tags || []
    };
  }, [route.params]);

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        <TransparentView>
          <WhiteView style={styles.typeSelector}>
            <RadioInput
              value={formType}
              label={t('common.addNew')}
              permittedValues={formTypes}
              onValueChange={(value) => {
                setFormType(value.id as TaskType);
              }}
            />
          </WhiteView>
          <TransparentView style={formType !== 'DUE_DATE' && styles.hidden}>
            <AddDueDateForm
              defaults={dueDateDefaults}
              onSuccess={() => navigation.goBack()}
            />
          </TransparentView>
          <TransparentView style={formType !== 'TRANSPORT' && styles.hidden}>
            <AddTransportTaskForm
              defaults={taskDefaults}
              onSuccess={() => navigation.goBack()}
            />
          </TransparentView>
          <TransparentView
            style={!['TASK', 'APPOINTMENT'].includes(formType) && styles.hidden}
          >
            <AddTaskForm
              formType={
                formType === 'TASK' || formType === 'APPOINTMENT'
                  ? formType
                  : 'TASK'
              }
              defaults={taskDefaults}
              onSuccess={() => navigation.goBack()}
            />
          </TransparentView>
        </TransparentView>
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}

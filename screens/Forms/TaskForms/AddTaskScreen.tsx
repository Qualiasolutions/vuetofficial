import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  useDueDateFieldTypes,
  useTaskBottomFieldTypes,
  useTaskMiddleFieldTypes,
  useTaskTopFieldTypes
} from './taskFormFieldTypes';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import TypedForm from 'components/forms/TypedForm';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { FieldValueTypes } from 'components/forms/types';
import { StyleSheet } from 'react-native';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  useCreateFlexibleFixedTaskMutation,
  useCreateTaskMutation,
  useCreateTaskWithoutCacheInvalidationMutation
} from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import RadioInput from 'components/forms/components/RadioInput';
import useGetUserDetails from 'hooks/useGetUserDetails';
import useColouredHeader from 'headers/hooks/useColouredHeader';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import hasAllRequired from 'components/forms/utils/hasAllRequired';
import dayjs from 'dayjs';

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
  }
];
type AddTaskFormType = 'TASK' | 'APPOINTMENT' | 'DUE_DATE';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  typeSelector: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginBottom: 20
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    zIndex: -1,
    justifyContent: 'center'
  },
  spinner: { marginTop: 20 }
});

export default function AddTaskScreen() {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();
  const [formType, setFormType] = useState<AddTaskFormType>('TASK');

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();
  const [createFlexibleTask, createFlexibleTaskResult] =
    useCreateFlexibleFixedTaskMutation();

  const isSubmitting =
    createTaskResult.isLoading ||
    createFlexibleTaskResult.isLoading ||
    createTaskWithoutMutationResult.isLoading;

  const fieldColor = useThemeColor({}, 'almostWhite');
  const headerBackgroundColor = useThemeColor({}, 'secondary');
  const headerTintColor = useThemeColor({}, 'white');
  const headerTitle = {
    TASK: 'Add task',
    APPOINTMENT: 'Add Appointment',
    DUE_DATE: 'Add Due Date'
  }[formType];

  useColouredHeader(headerBackgroundColor, headerTintColor, headerTitle);

  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    {}
  );
  useState<FieldValueTypes>({});
  const [taskMiddleFieldValues, setTaskMiddleFieldValues] =
    useState<FieldValueTypes>({});
  const [taskBottomFieldValues, setTaskBottomFieldValues] =
    useState<FieldValueTypes>({});
  const [dueDateFieldValues, setDueDateFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const taskTopFields = useTaskTopFieldTypes();
  const taskMiddleFields = useTaskMiddleFieldTypes();
  const taskBottomFields = useTaskBottomFieldTypes();
  const dueDateFields = useDueDateFieldTypes();

  useEffect(() => {
    if (userDetails) {
      const initialTopFields = createInitialObject(taskTopFields, userDetails);
      setTaskTopFieldValues(initialTopFields);

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

      const initialMiddleFields = createInitialObject(
        taskMiddleFields,
        userDetails,
        {
          start_datetime: defaultStartTime,
          end_datetime: defaultEndTime,
          duration_minutes: defaultDuration,
          recurrence: null,
          earliest_action_date: defaultEarliestActionDate,
          due_date: defaultDueDate
        }
      );
      setTaskMiddleFieldValues(initialMiddleFields);

      const initialBottomFields = createInitialObject(
        taskBottomFields,
        userDetails
      );
      setTaskBottomFieldValues(initialBottomFields);

      const initialDueDateFields = createInitialObject(
        dueDateFields,
        userDetails,
        { reminder_timedelta: '14 days, 0:00:00' }
      );
      setDueDateFieldValues(initialDueDateFields);

      setResetState(() => () => {
        setDueDateFieldValues(initialDueDateFields);
        setTaskTopFieldValues(initialTopFields);
        setTaskMiddleFieldValues(initialMiddleFields);
        setTaskBottomFieldValues(initialBottomFields);
      });

      setLoadedFields(true);
    }
  }, [
    userDetails,
    formType,
    dueDateFields,
    taskTopFields,
    taskMiddleFields,
    taskBottomFields
  ]);

  const hasRequired = useMemo(() => {
    if (formType === 'DUE_DATE') {
      return hasAllRequired(dueDateFieldValues, dueDateFields);
    } else {
      return (
        hasAllRequired(taskTopFieldValues, taskTopFields) &&
        hasAllRequired(taskMiddleFieldValues, taskMiddleFields) &&
        hasAllRequired(taskBottomFieldValues, taskBottomFields)
      );
    }
  }, [
    taskTopFieldValues,
    taskMiddleFieldValues,
    taskBottomFieldValues,
    dueDateFields,
    taskTopFields,
    taskMiddleFields,
    taskBottomFields,
    dueDateFieldValues,
    formType
  ]);

  const submitForm = async () => {
    if (formType === 'DUE_DATE') {
      const parsedDueDateFieldValues = parseFormValues(
        dueDateFieldValues,
        dueDateFields
      );
      const parsedFieldValues: any = {
        ...parsedDueDateFieldValues,
        end_date: parsedDueDateFieldValues.start_date,
        resourcetype: 'DueDate'
      };

      try {
        if (parsedFieldValues.recurrence) {
          await createTask(parsedFieldValues).unwrap();
        } else {
          await createTaskWithoutCacheInvalidation(parsedFieldValues).unwrap();
        }
        Toast.show({
          type: 'success',
          text1: t('screens.addTask.createSuccess')
        });
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: t('common.errors.generic')
        });
      }
    } else {
      const parsedTopFieldValues = parseFormValues(
        taskTopFieldValues,
        taskTopFields
      );
      const parsedMiddleFieldValues = parseFormValues(
        taskMiddleFieldValues,
        taskMiddleFields
      );
      const parsedBottomFieldValues = parseFormValues(
        taskBottomFieldValues,
        taskBottomFields
      );

      const parsedFieldValues: any = {
        ...parsedTopFieldValues,
        ...parsedMiddleFieldValues,
        ...parsedBottomFieldValues,
        type: formType,
        resourcetype: 'FixedTask'
      };

      try {
        if (parsedFieldValues.is_flexible) {
          await createFlexibleTask(parsedFieldValues).unwrap();
        } else {
          if (parsedFieldValues.recurrence) {
            await createTask(parsedFieldValues).unwrap();
          } else {
            await createTaskWithoutCacheInvalidation(
              parsedFieldValues
            ).unwrap();
          }
        }
        Toast.show({
          type: 'success',
          text1: t('screens.addTask.createSuccess')
        });
        resetState();
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: t('common.errors.generic')
        });
      }
    }
  };

  if (!(userDetails && loadedFields)) {
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
                setFormType(value.id as AddTaskFormType);
              }}
            />
          </WhiteView>
          {formType === 'DUE_DATE' ? (
            <TypedForm
              fields={dueDateFields}
              formValues={dueDateFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setDueDateFieldValues(values);
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          ) : (
            <TypedForm
              fields={taskTopFields}
              formValues={taskTopFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskTopFieldValues(values);
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          )}
        </TransparentView>
        {formType !== 'DUE_DATE' && (
          <TransparentView>
            <TypedForm
              fields={taskMiddleFields}
              formValues={taskMiddleFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskMiddleFieldValues(values);
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          </TransparentView>
        )}
        {formType === 'APPOINTMENT' && (
          <TransparentView>
            <TypedForm
              fields={taskBottomFields}
              formValues={taskBottomFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskBottomFieldValues(values);
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          </TransparentView>
        )}

        {isSubmitting ? (
          <PaddedSpinner spinnerColor="buttonDefault" style={styles.spinner} />
        ) : (
          <TransparentPaddedView style={styles.bottomButtons}>
            <Button
              title={t('screens.addTask.createTask')}
              onPress={() => {
                submitForm();
              }}
              disabled={!hasRequired}
            />
          </TransparentPaddedView>
        )}
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}

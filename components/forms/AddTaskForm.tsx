import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  useTaskBottomFieldTypes,
  useTaskMiddleFieldTypes,
  useTaskTopFieldTypes
} from './taskFormFieldTypes';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  TransparentPaddedView,
  TransparentView,
  WhitePaddedView
} from 'components/molecules/ViewComponents';
import TypedForm from 'components/forms/TypedForm';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { FieldValueTypes } from 'components/forms/types';
import { StyleSheet } from 'react-native';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  useCreateFlexibleFixedTaskMutation,
  useCreateRecurrentTaskOverwriteMutation,
  useCreateTaskMutation,
  useCreateTaskWithoutCacheInvalidationMutation
} from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import hasAllRequired from 'components/forms/utils/hasAllRequired';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import DropDown from './components/DropDown';
import { elevation } from 'styles/elevation';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    zIndex: -1,
    justifyContent: 'center'
  },
  spinner: { marginTop: 20 },
  hidden: { display: 'none' },
  typeSelectorSection: { marginBottom: 50 }
});

type AddTaskFormProps = {
  formType: 'TASK' | 'APPOINTMENT' | 'ACTIVITY';
  defaults: {
    title: string;
    tags: string[];
    start_datetime?: Date;
    end_datetime?: Date;
    date?: string;
    duration?: number;
    is_any_time?: boolean;
    entities?: number[];
    members?: number[];
  };
  onSuccess: () => void;
  taskId?: number;
  recurrenceIndex?: number;
  recurrenceOverwrite?: boolean;
};

export default function AddTaskForm({
  defaults,
  formType,
  onSuccess,
  taskId,
  recurrenceIndex,
  recurrenceOverwrite
}: AddTaskFormProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();
  const [createFlexibleTask, createFlexibleTaskResult] =
    useCreateFlexibleFixedTaskMutation();

  const [createRecurrentOverwrite, createRecurrentOverwriteResult] =
    useCreateRecurrentTaskOverwriteMutation();

  const [activityType, setActivityType] = useState('ACTIVITY');

  const isSubmitting =
    createTaskResult.isLoading ||
    createFlexibleTaskResult.isLoading ||
    createTaskWithoutMutationResult.isLoading ||
    createRecurrentOverwriteResult.isLoading;

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    {}
  );
  useState<FieldValueTypes>({});
  const [taskMiddleFieldValues, setTaskMiddleFieldValues] =
    useState<FieldValueTypes>({});
  const [taskBottomFieldValues, setTaskBottomFieldValues] =
    useState<FieldValueTypes>({});

  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const taskTopFields = useTaskTopFieldTypes();
  const taskMiddleFields = useTaskMiddleFieldTypes(
    !!recurrenceOverwrite,
    false,
    !recurrenceOverwrite
  );
  const taskBottomFields = useTaskBottomFieldTypes();
  const taskObj = useSelector(selectTaskById(taskId || -1));

  const initialTopFields = useMemo(() => {
    if (!userDetails) {
      return null;
    }

    const topFieldsOverrides: { [key: string]: any } = {};
    if (defaults?.title) {
      topFieldsOverrides.title = defaults.title;
    }

    if (defaults?.members) {
      topFieldsOverrides.members = defaults.members;
    }

    topFieldsOverrides.tagsAndEntities = {
      entities: defaults?.entities || [],
      tags: defaults?.tags || []
    };

    return createInitialObject(taskTopFields, userDetails, topFieldsOverrides);
  }, [taskTopFields, userDetails, defaults]);

  const initialMiddleFields = useMemo(() => {
    if (!userDetails) {
      return null;
    }

    const startTimeProp = defaults.start_datetime;
    const endTimeProp = defaults.end_datetime;
    const defaultStartTime = startTimeProp
      ? new Date(startTimeProp)
      : new Date();

    defaultStartTime.setMinutes(0);
    defaultStartTime.setSeconds(0);
    defaultStartTime.setMilliseconds(0);

    let defaultEndTime = endTimeProp
      ? new Date(endTimeProp)
      : new Date(defaultStartTime);
    if (!endTimeProp) {
      if (formType === 'TASK') {
        defaultEndTime.setMinutes(defaultStartTime.getMinutes() + 15);
      }
      if (formType === 'APPOINTMENT' || formType === 'ACTIVITY') {
        defaultEndTime.setHours(defaultStartTime.getHours() + 1);
      }
    }

    const defaultDuration = defaults.duration || 15;
    const defaultEarliestActionDate = dayjs(new Date()).format('YYYY-MM-DD');

    const defaultDate = defaults.date ? new Date(defaults.date) : new Date();
    if (!defaults.date) {
      defaultDate.setDate(defaultDate.getDate() + 7);
    }
    const defaultDueDate = dayjs(defaultDate).format('YYYY-MM-DD');

    return createInitialObject(taskMiddleFields, userDetails, {
      start_datetime: defaultStartTime,
      end_datetime: defaultEndTime,
      date: defaultDueDate,
      duration: defaultDuration,
      recurrence: null,
      earliest_action_date: defaultEarliestActionDate,
      due_date: defaultDueDate,
      is_any_time: !!defaults.is_any_time
    });
  }, [taskMiddleFields, userDetails, formType, defaults]);

  const initialBottomFields = useMemo(() => {
    if (!userDetails) {
      return null;
    }

    return createInitialObject(taskBottomFields, userDetails);
  }, [taskBottomFields, userDetails]);

  useEffect(() => {
    if (userDetails) {
      if (initialTopFields) {
        setTaskTopFieldValues(initialTopFields);
      }

      if (initialMiddleFields) {
        setTaskMiddleFieldValues(initialMiddleFields);
      }

      if (initialBottomFields) {
        setTaskBottomFieldValues(initialBottomFields);
      }

      if (initialTopFields && initialMiddleFields && initialBottomFields) {
        setResetState(() => () => {
          setTaskTopFieldValues(initialTopFields);
          setTaskMiddleFieldValues(initialMiddleFields);
          setTaskBottomFieldValues(initialBottomFields);
        });
      }

      setLoadedFields(true);
    }
  }, [
    initialTopFields,
    initialMiddleFields,
    initialBottomFields,
    userDetails,
    formType,
    taskBottomFields
  ]);

  const hasRequired = useMemo(() => {
    return (
      hasAllRequired(taskTopFieldValues, taskTopFields) &&
      hasAllRequired(taskMiddleFieldValues, taskMiddleFields) &&
      hasAllRequired(taskBottomFieldValues, taskBottomFields)
    );
  }, [
    taskTopFieldValues,
    taskMiddleFieldValues,
    taskBottomFieldValues,
    taskTopFields,
    taskMiddleFields,
    taskBottomFields
  ]);

  const submitForm = async () => {
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
      type: formType === 'ACTIVITY' ? activityType : formType,
      resourcetype: 'FixedTask'
    };

    try {
      if (
        recurrenceOverwrite &&
        recurrenceIndex !== undefined &&
        taskObj &&
        taskObj.recurrence
      ) {
        await createRecurrentOverwrite({
          task: parsedFieldValues,
          recurrence: taskObj.recurrence.id,
          recurrence_index: recurrenceIndex,
          baseTaskId: taskObj.id
        }).unwrap();
      } else {
        if (parsedFieldValues.is_flexible) {
          await createFlexibleTask(parsedFieldValues).unwrap();
        } else {
          if (
            parsedFieldValues.recurrence ||
            (parsedFieldValues.actions && parsedFieldValues.actions.length > 0)
          ) {
            await createTask(parsedFieldValues).unwrap();
          } else {
            await createTaskWithoutCacheInvalidation(
              parsedFieldValues
            ).unwrap();
          }
        }
      }
      Toast.show({
        type: 'success',
        text1: t('screens.addTask.createSuccess')
      });
      resetState();
      onSuccess();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
    }
  };

  const topFieldsTypedForm = useMemo(
    () => (
      <TypedForm
        fields={taskTopFields}
        formValues={taskTopFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setTaskTopFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [taskTopFields, taskTopFieldValues, fieldColor]
  );

  const middleFieldsTypedForm = useMemo(
    () => (
      <TypedForm
        fields={taskMiddleFields}
        formValues={taskMiddleFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setTaskMiddleFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [taskMiddleFields, taskMiddleFieldValues, fieldColor]
  );

  const bottomFieldsTypedForm = useMemo(
    () => (
      <TypedForm
        fields={taskBottomFields}
        formValues={taskBottomFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setTaskBottomFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [taskBottomFields, taskBottomFieldValues, fieldColor]
  );

  if (!(userDetails && loadedFields)) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView style={styles.container}>
      {formType === 'ACTIVITY' && (
        <WhitePaddedView
          style={[styles.typeSelectorSection, elevation.elevated]}
        >
          <DropDown
            value={activityType}
            items={[
              {
                value: 'ACTIVITY',
                label: 'Activity'
              },
              {
                value: 'FOOD_ACTIVITY',
                label: 'Food'
              },
              {
                value: 'OTHER_ACTIVITY',
                label: 'Other'
              }
            ]}
            setFormValues={setActivityType}
            listMode="MODAL"
          />
        </WhitePaddedView>
      )}
      <TransparentView>{topFieldsTypedForm}</TransparentView>
      <TransparentView>{middleFieldsTypedForm}</TransparentView>
      <TransparentView
        style={!['APPOINTMENT', 'ACTIVITY'].includes(formType) && styles.hidden}
      >
        {bottomFieldsTypedForm}
      </TransparentView>

      {isSubmitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" style={styles.spinner} />
      ) : (
        <TransparentPaddedView style={styles.bottomButtons}>
          <Button
            title={
              recurrenceOverwrite ? t('common.update') : t('common.create')
            }
            onPress={() => {
              submitForm();
            }}
            disabled={!hasRequired}
          />
        </TransparentPaddedView>
      )}
    </TransparentView>
  );
}

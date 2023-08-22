import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

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
import { StyleSheet, ViewStyle } from 'react-native';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  useCreateFlexibleFixedTaskMutation,
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
import RecurrentUpdateModal from './RecurrentUpdateModal';
import { Recurrence, Reminder } from 'types/tasks';
import { useTaskFieldTypes } from './taskFormFieldTypes';

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
  typeSelectorSection: {}
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
    recurrence?: Recurrence | null;
    reminders?: Reminder[];
  };
  onSuccess: () => void;
  taskId?: number;
  recurrenceIndex?: number;
  recurrenceOverwrite?: boolean;
  inlineFields?: boolean;
  sectionStyle?: ViewStyle;
};

export default function AddTaskForm({
  defaults,
  formType,
  onSuccess,
  taskId,
  recurrenceIndex,
  recurrenceOverwrite,
  inlineFields,
  sectionStyle
}: AddTaskFormProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();
  const [createFlexibleTask, createFlexibleTaskResult] =
    useCreateFlexibleFixedTaskMutation();

  const [activityType, setActivityType] = useState('ACTIVITY');

  const [showRecurrentUpdateModal, setShowRecurrentUpdateModal] =
    useState(false);

  const isSubmitting =
    createTaskResult.isLoading ||
    createFlexibleTaskResult.isLoading ||
    createTaskWithoutMutationResult.isLoading;

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [taskFieldValues, setTaskFieldValues] = useState<FieldValueTypes>({});

  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const [fieldValues, setFieldValues] = useState<any>({});

  const taskFields = useTaskFieldTypes({
    disableFlexible: !!recurrenceOverwrite
  });
  const taskObj = useSelector(selectTaskById(taskId || -1));

  const initialTaskFields = useMemo(() => {
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

    return createInitialObject(taskFields, userDetails, {
      title: defaults.title,
      members: defaults.members,
      tagsAndEntities: {
        entities: defaults?.entities || [],
        tags: defaults?.tags || []
      },
      start_datetime: defaultStartTime,
      end_datetime: defaultEndTime,
      date: defaultDueDate,
      duration: defaultDuration,
      earliest_action_date: defaultEarliestActionDate,
      due_date: defaultDueDate,
      is_any_time: !!defaults.is_any_time,
      recurrence: defaults.recurrence,
      reminders: defaults.reminders
    });
  }, [taskFields, userDetails, defaults, formType]);

  useEffect(() => {
    if (userDetails) {
      if (initialTaskFields) {
        setTaskFieldValues(initialTaskFields);
      }

      if (initialTaskFields) {
        setResetState(() => () => {
          setTaskFieldValues(initialTaskFields);
        });
      }

      setLoadedFields(true);
    }
  }, [initialTaskFields, userDetails, formType, taskFields]);

  const hasRequired = useMemo(() => {
    return hasAllRequired(taskFieldValues, taskFields);
  }, [taskFieldValues, taskFields]);

  const submitForm = async () => {
    const parsedTaskFieldValues = parseFormValues(taskFieldValues, taskFields);

    const parsedFieldValues: any = {
      ...parsedTaskFieldValues,
      type: formType === 'ACTIVITY' ? activityType : formType,
      resourcetype: 'FixedTask'
    };

    setFieldValues(parsedFieldValues);

    try {
      if (recurrenceOverwrite) {
        setShowRecurrentUpdateModal(true);
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
        Toast.show({
          type: 'success',
          text1: t('screens.addTask.createSuccess')
        });
        resetState();
        onSuccess();
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
    }
  };

  const taskTypedForm = useMemo(
    () => (
      <TypedForm
        fields={taskFields}
        formValues={taskFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setTaskFieldValues(values);
        }}
        inlineFields={!!inlineFields}
        sectionStyle={sectionStyle}
        fieldColor={fieldColor}
      />
    ),
    [taskFields, taskFieldValues, fieldColor, inlineFields, sectionStyle]
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
      <TransparentView>{taskTypedForm}</TransparentView>

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
      <RecurrentUpdateModal
        visible={showRecurrentUpdateModal}
        onRequestClose={() => setShowRecurrentUpdateModal(false)}
        recurrence={taskObj?.recurrence?.id || -1}
        recurrenceIndex={recurrenceIndex === undefined ? -1 : recurrenceIndex}
        taskId={taskId || -1}
        parsedFieldValues={fieldValues}
      />
    </TransparentView>
  );
}

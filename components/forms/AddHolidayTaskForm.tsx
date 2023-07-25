import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { useHolidayFieldTypes } from './taskFormFieldTypes';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import TypedForm from 'components/forms/TypedForm';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { FieldValueTypes } from 'components/forms/types';
import { StyleSheet } from 'react-native';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
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

type AddHolidayTaskFormProps = {
  onSuccess: () => void;
  recurrenceOverwrite?: boolean;
  recurrenceIndex?: number;
  taskId?: number;
};

export default function AddHolidayTaskForm({
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  taskId
}: AddHolidayTaskFormProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();

  const [createRecurrentOverwrite, createRecurrentOverwriteResult] =
    useCreateRecurrentTaskOverwriteMutation();

  const taskObj = useSelector(selectTaskById(taskId || -1));

  const isSubmitting =
    createTaskResult.isLoading ||
    createTaskWithoutMutationResult.isLoading ||
    createRecurrentOverwriteResult.isLoading;

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [holidayTaskFieldValues, setHolidayFieldValues] =
    useState<FieldValueTypes>({});
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const holidayFields = useHolidayFieldTypes(false);

  const initialHolidayFields = useMemo(() => {
    if (!userDetails) {
      return null;
    }

    const defaultDueDate = new Date();
    const defaultRecurrence = {
      earliest_occurrence: defaultDueDate,
      latest_occurrence: null,
      interval_length: 1,
      recurrence: 'YEARLY'
    };

    return createInitialObject(holidayFields, userDetails, {
      start_date: defaultDueDate,
      end_date: defaultDueDate,
      title: '',
      duration: 15,
      tagsAndEntities: {
        entities: [],
        tags: []
      },
      recurrence: defaultRecurrence
    });
  }, [holidayFields, userDetails]);

  useEffect(() => {
    if (userDetails) {
      if (initialHolidayFields) {
        setHolidayFieldValues(initialHolidayFields);
      }

      if (initialHolidayFields) {
        setResetState(() => () => {
          setHolidayFieldValues(initialHolidayFields);
        });
      }

      setLoadedFields(true);
    }
  }, [initialHolidayFields, userDetails, holidayFields]);

  const hasRequired = useMemo(() => {
    return hasAllRequired(holidayTaskFieldValues, holidayFields);
  }, [holidayFields, holidayTaskFieldValues]);

  const submitForm = async () => {
    const parsedDueDateFieldValues = parseFormValues(
      holidayTaskFieldValues,
      holidayFields
    );
    const parsedFieldValues: any = {
      ...parsedDueDateFieldValues,
      end_date: parsedDueDateFieldValues.start_date,
      type: 'HOLIDAY',
      resourcetype: 'HolidayTask',
      duration: 15
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
        if (
          parsedFieldValues.recurrence ||
          (parsedFieldValues.actions && parsedFieldValues.actions.length > 0)
        ) {
          await createTask(parsedFieldValues).unwrap();
        } else {
          await createTaskWithoutCacheInvalidation(parsedFieldValues).unwrap();
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

  const holidayTypedForm = useMemo(
    () => (
      <TypedForm
        fields={holidayFields}
        formValues={holidayTaskFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setHolidayFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [holidayFields, holidayTaskFieldValues, fieldColor]
  );

  if (!(userDetails && loadedFields)) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView style={styles.container}>
      {holidayTypedForm}
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

import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { useDueDateFieldTypes } from './taskFormFieldTypes';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
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
  hidden: { display: 'none' }
});

type AddDueDateFormProps = {
  defaults: {
    title: string;
    date: string;
    entities: number[];
    tags: string[];
  };
  onSuccess: () => void;
  recurrenceOverwrite?: boolean;
  recurrenceIndex?: number;
  taskId?: number;
};

export default function AddDueDateForm({
  defaults,
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  taskId
}: AddDueDateFormProps) {
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

  const [dueDateFieldValues, setDueDateFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const dueDateFields = useDueDateFieldTypes(
    false,
    '',
    false,
    !recurrenceOverwrite
  );

  const initialDueDateFields = useMemo(() => {
    if (!userDetails) {
      return null;
    }

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const defaultDueDate =
      defaults?.date || dayjs(nextWeek).format('YYYY-MM-DD');

    return createInitialObject(dueDateFields, userDetails, {
      date: defaultDueDate,
      title: defaults?.title || '',
      duration: 15,
      tagsAndEntities: {
        entities: defaults?.entities || [],
        tags: defaults?.tags || []
      }
    });
  }, [dueDateFields, userDetails, defaults]);

  useEffect(() => {
    if (userDetails) {
      if (initialDueDateFields) {
        setDueDateFieldValues(initialDueDateFields);
      }

      if (initialDueDateFields) {
        setResetState(() => () => {
          setDueDateFieldValues(initialDueDateFields);
        });
      }

      setLoadedFields(true);
    }
  }, [initialDueDateFields, userDetails, dueDateFields]);

  const hasRequired = useMemo(() => {
    return hasAllRequired(dueDateFieldValues, dueDateFields);
  }, [dueDateFields, dueDateFieldValues]);

  const submitForm = async () => {
    const parsedDueDateFieldValues = parseFormValues(
      dueDateFieldValues,
      dueDateFields
    );
    const parsedFieldValues: any = {
      ...parsedDueDateFieldValues,
      end_date: parsedDueDateFieldValues.start_date,
      type: 'DUE_DATE',
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

  const dueDateTypedForm = useMemo(
    () => (
      <TypedForm
        fields={dueDateFields}
        formValues={dueDateFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setDueDateFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [dueDateFields, dueDateFieldValues, fieldColor]
  );

  if (!(userDetails && loadedFields)) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView style={styles.container}>
      {dueDateTypedForm}
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

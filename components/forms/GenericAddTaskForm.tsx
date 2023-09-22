import { useNavigation } from '@react-navigation/native';
import { Button } from 'components/molecules/ButtonComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { useThemeColor } from 'components/Themed';
import {
  isAccommodationTaskType,
  isActivityTaskType,
  isAnniversaryTaskType,
  isTransportTaskType
} from 'constants/TaskTypes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ViewStyle } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  useCreateTaskMutation,
  useCreateTaskWithoutCacheInvalidationMutation,
  useUpdateTaskMutation
} from 'reduxStore/services/api/tasks';
import { FixedTaskResponseType, TaskType } from 'types/tasks';
import RecurrentUpdateModal from './RecurrentUpdateModal';
import { useFieldTypesForFormType } from './taskFormFieldTypes';
import TypedForm from './TypedForm';
import { FieldValueTypes } from './types';
import hasAllRequired from './utils/hasAllRequired';
import parseFormValues from './utils/parseFormValues';

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  }
});

export default function GenericAddTaskForm({
  type,
  defaults,
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  isEdit,
  taskId,
  inlineFields = true,
  sectionStyle
}: {
  type: TaskType;
  defaults: any;
  onSuccess?: () => void;
  recurrenceOverwrite?: boolean;
  recurrenceIndex?: number;
  isEdit?: boolean;
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

  const [taskFieldValues, setTaskFieldValues] = useState<FieldValueTypes>({});
  const [showRecurrentUpdateModal, setShowRecurrentUpdateModal] =
    useState(false);
  const [stateParsedFieldValues, setStateParsedFieldValues] = useState({});
  const fieldColor = useThemeColor({}, 'almostWhite');
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();
  const [updateTask, updateTaskResult] = useUpdateTaskMutation();

  useEffect(() => {
    const defaultRecurrence = ['ANNIVERSARY', 'BIRTHDAY'].includes(type)
      ? {
          earliest_occurrence: null,
          latest_occurrence: null,
          interval_length: 1,
          recurrence: 'YEARLY'
        }
      : null;
    setTaskFieldValues((v) => ({
      ...defaults,
      ...v,
      recurrence: defaultRecurrence
    }));
  }, [defaults, type]);

  const isSubmitting =
    createTaskResult.isLoading ||
    createTaskWithoutMutationResult.isLoading ||
    updateTaskResult.isLoading;

  const formType = useMemo(() => {
    if (!type) {
      return null;
    }
    if (isTransportTaskType(type)) {
      return 'TRANSPORT';
    }
    if (isAccommodationTaskType(type)) {
      return 'ACCOMMODATION';
    }
    if (isAnniversaryTaskType(type)) {
      return 'ANNIVERSARY';
    }
    if (isActivityTaskType(type)) {
      return 'ACTIVITY';
    }
    return type;
  }, [type]);

  const formFields = useFieldTypesForFormType(formType || null, {
    isEdit,
    disabledRecurrenceFields:
      recurrenceIndex !== undefined && !recurrenceOverwrite,
    disableFlexible: recurrenceIndex !== undefined,
    anniversaryType: isAnniversaryTaskType(type) ? type : undefined,
    transportType: isTransportTaskType(type) ? type : undefined,
    accommodationType: isAccommodationTaskType(type) ? type : undefined
  });

  const hasRequired = useMemo(() => {
    return hasAllRequired(taskFieldValues, formFields);
  }, [formFields, taskFieldValues]);

  const getParsedFieldValues = useCallback(() => {
    const resourceTypeMapping = {
      TASK: 'FixedTask',
      ACTIVITY: 'FixedTask',
      APPOINTMENT: 'FixedTask',
      DUE_DATE: 'FixedTask',
      TRANSPORT: 'TransportTask',
      ACCOMMODATION: 'AccommodationTask',
      ANNIVERSARY: 'AnniversaryTask',
      HOLIDAY: 'HolidayTask',
      '': 'FixedTask'
    };

    const parsedFormFieldValues = parseFormValues(taskFieldValues, formFields);
    const parsedFullFieldValues: any = {
      ...parsedFormFieldValues,
      type: type,
      resourcetype:
        formType === 'ANNIVERSARY' && type === 'BIRTHDAY'
          ? 'BirthdayTask'
          : resourceTypeMapping[formType || '']
    };

    if (parsedFormFieldValues.date && !parsedFormFieldValues.duration) {
      if (!parsedFormFieldValues.start_date) {
        parsedFullFieldValues.start_date = parsedFormFieldValues.date;
      }
      if (!parsedFormFieldValues.end_date) {
        parsedFullFieldValues.end_date = parsedFullFieldValues.start_date;
      }

      delete parsedFullFieldValues.date;
    }

    return parsedFullFieldValues;
  }, [formFields, formType, taskFieldValues, type]);

  const submitCreateForm = async () => {
    const parsedFullFieldValues = getParsedFieldValues();

    try {
      if (
        parsedFullFieldValues.recurrence ||
        (parsedFullFieldValues.actions &&
          parsedFullFieldValues.actions.length > 0)
      ) {
        await createTask(parsedFullFieldValues).unwrap();
      } else {
        await createTaskWithoutCacheInvalidation(
          parsedFullFieldValues
        ).unwrap();
      }
      Toast.show({
        type: 'success',
        text1: t('screens.addTask.createSuccess')
      });
      // resetState();
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
    }
  };

  const updateTaskAndCallbacks = useCallback(
    async (
      body: Partial<FixedTaskResponseType> & Pick<FixedTaskResponseType, 'id'>
    ) => {
      try {
        await updateTask(body).unwrap();
        Toast.show({
          type: 'success',
          text1: t('screens.editTask.updateSuccess')
        });
        navigation.goBack();
      } catch (e) {
        Toast.show({
          type: 'error',
          text1: t('common.errors.generic')
        });
      }
    },
    [navigation, t, updateTask]
  );

  const submitUpdateForm = () => {
    if (taskId) {
      const parsedTaskFieldValues = getParsedFieldValues();

      const body = {
        ...parsedTaskFieldValues,
        resourcetype: 'FixedTask' as 'FixedTask',
        type,
        id: taskId
      };

      if (recurrenceIndex !== undefined) {
        delete body.recurrence;
      }

      updateTaskAndCallbacks(body);
    }
  };

  if (!formType) {
    return null;
  }

  if (Object.keys(taskFieldValues).length === 0) {
    return null;
  }

  return (
    <>
      <TypedForm
        fields={formFields}
        formValues={taskFieldValues}
        onFormValuesChange={setTaskFieldValues}
        inlineFields={inlineFields}
        fieldColor={fieldColor}
        sectionStyle={sectionStyle}
      />
      <TransparentPaddedView style={styles.bottomButtons}>
        {isSubmitting ? (
          <PaddedSpinner spinnerColor="buttonDefault" />
        ) : isEdit ? (
          recurrenceOverwrite ? (
            <Button
              title={t('common.update')}
              onPress={() => {
                const parsedTaskFieldValues = getParsedFieldValues();
                setStateParsedFieldValues(parsedTaskFieldValues);
                setShowRecurrentUpdateModal(true);
              }}
              disabled={!hasRequired}
            />
          ) : (
            <TransparentView>
              <Button
                title={t('common.update')}
                onPress={() => {
                  submitUpdateForm();
                }}
                disabled={!hasRequired}
              />
            </TransparentView>
          )
        ) : (
          <Button
            title={t('common.create')}
            onPress={() => {
              submitCreateForm();
            }}
            disabled={!hasRequired}
          />
        )}
      </TransparentPaddedView>
      <RecurrentUpdateModal
        visible={showRecurrentUpdateModal}
        onRequestClose={() => setShowRecurrentUpdateModal(false)}
        recurrence={taskFieldValues?.recurrence?.id || -1}
        recurrenceIndex={recurrenceIndex === undefined ? -1 : recurrenceIndex}
        taskId={taskId || -1}
        parsedFieldValues={stateParsedFieldValues}
      />
    </>
  );
}

import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { useTransportFieldTypes } from './taskFormFieldTypes';
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
  useCreateRecurrentTaskOverwriteMutation,
  useCreateTaskMutation,
  useCreateTaskWithoutCacheInvalidationMutation
} from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import hasAllRequired from 'components/forms/utils/hasAllRequired';
import { useSelector } from 'react-redux';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import DropDown from './components/DropDown';
import { elevation } from 'styles/elevation';
import { TransportTaskType } from 'types/tasks';

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
  typeSelectorSection: { marginBottom: 50 }
});

type AddTransportTaskFormProps = {
  defaults: {
    title: string;
    start_datetime: Date;
    end_datetime: Date;
    entities: number[];
    tags: string[];
  };
  onSuccess: () => void;
  recurrenceOverwrite?: boolean;
  recurrenceIndex?: number;
  taskId?: number;
};

export default function AddTransportTaskForm({
  defaults,
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  taskId
}: AddTransportTaskFormProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();
  const [type, setType] = useState<TransportTaskType>('FLIGHT');

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

  const [flightFieldValues, setFlightFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const flightFields = useTransportFieldTypes(type);

  const initialFlightFields = useMemo(() => {
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
    defaultEndTime.setHours(defaultStartTime.getHours() + 1);

    return createInitialObject(flightFields, userDetails, {
      start_datetime: defaultStartTime,
      end_datetime: defaultEndTime,
      title: defaults?.title || '',
      tagsAndEntities: {
        entities: defaults?.entities || [],
        tags: defaults?.tags || []
      }
    });
  }, [flightFields, userDetails, defaults]);

  useEffect(() => {
    if (userDetails) {
      if (initialFlightFields) {
        setFlightFieldValues(initialFlightFields);
      }

      if (initialFlightFields) {
        setResetState(() => () => {
          setFlightFieldValues(initialFlightFields);
        });
      }

      setLoadedFields(true);
    }
  }, [initialFlightFields, userDetails, flightFields]);

  const hasRequired = useMemo(() => {
    return hasAllRequired(flightFieldValues, flightFields);
  }, [flightFields, flightFieldValues]);

  const submitForm = async () => {
    const parsedFlightFieldValues = parseFormValues(
      flightFieldValues,
      flightFields
    );
    const parsedFieldValues: any = {
      ...parsedFlightFieldValues,
      type,
      resourcetype: 'TransportTask'
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

  const flightTypedForm = useMemo(
    () => (
      <TypedForm
        fields={flightFields}
        formValues={flightFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setFlightFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [flightFields, flightFieldValues, fieldColor]
  );

  if (!(userDetails && loadedFields)) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView style={styles.container}>
      <WhitePaddedView style={[styles.typeSelectorSection, elevation.elevated]}>
        <DropDown
          value={type}
          items={[
            {
              value: 'FLIGHT',
              label: 'Flight'
            },
            {
              value: 'TRAIN',
              label: 'Train / Public Transport'
            },
            {
              value: 'RENTAL_CAR',
              label: 'Rental Car'
            },
            {
              value: 'TAXI',
              label: 'Taxi'
            },
            {
              value: 'DRIVE_TIME',
              label: 'Drive Time'
            }
          ]}
          setFormValues={setType}
          listMode="MODAL"
        />
      </WhitePaddedView>
      {flightTypedForm}
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

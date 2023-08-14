import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { useAccommodationFieldTypes } from './taskFormFieldTypes';
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
import { AccommodationTaskType } from 'types/tasks';
import RecurrentUpdateModal from './RecurrentUpdateModal';

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

export default function AddAccommodationTaskForm({
  defaults,
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  taskId
}: AddTransportTaskFormProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();
  const [type, setType] = useState<AccommodationTaskType>('HOTEL');

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();
  const taskObj = useSelector(selectTaskById(taskId || -1));

  const [showRecurrentUpdateModal, setShowRecurrentUpdateModal] =
    useState(false);

  const [fieldValues, setFieldValues] = useState<any>({});

  const isSubmitting =
    createTaskResult.isLoading || createTaskWithoutMutationResult.isLoading;

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [accommodationFieldValues, setAccommodationFieldValues] =
    useState<FieldValueTypes>({});
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const accommodationFields = useAccommodationFieldTypes(type);

  const initialAccommodationFields = useMemo(() => {
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

    return createInitialObject(accommodationFields, userDetails, {
      start_datetime: defaultStartTime,
      end_datetime: defaultEndTime,
      title: defaults?.title || '',
      tagsAndEntities: {
        entities: defaults?.entities || [],
        tags: defaults?.tags || []
      }
    });
  }, [accommodationFields, userDetails, defaults]);

  useEffect(() => {
    if (userDetails) {
      if (initialAccommodationFields) {
        setAccommodationFieldValues(initialAccommodationFields);
      }

      if (initialAccommodationFields) {
        setResetState(() => () => {
          setAccommodationFieldValues(initialAccommodationFields);
        });
      }

      setLoadedFields(true);
    }
  }, [initialAccommodationFields, userDetails, accommodationFields]);

  const hasRequired = useMemo(() => {
    return hasAllRequired(accommodationFieldValues, accommodationFields);
  }, [accommodationFields, accommodationFieldValues]);

  const submitForm = async () => {
    const parsedTransportTaskFieldValues = parseFormValues(
      accommodationFieldValues,
      accommodationFields
    );
    const parsedFieldValues: any = {
      ...parsedTransportTaskFieldValues,
      type,
      resourcetype: 'AccommodationTask'
    };

    setFieldValues(parsedFieldValues);

    try {
      if (recurrenceOverwrite) {
        setShowRecurrentUpdateModal(true);
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

  const accommodationTypedForm = useMemo(
    () => (
      <TypedForm
        fields={accommodationFields}
        formValues={accommodationFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setAccommodationFieldValues(values);
        }}
        inlineFields={true}
        fieldColor={fieldColor}
      />
    ),
    [accommodationFields, accommodationFieldValues, fieldColor]
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
              value: 'HOTEL',
              label: 'Hotel'
            },
            {
              value: 'STAY_WITH_FRIEND',
              label: 'Stay With Friend'
            }
          ]}
          setFormValues={setType}
          listMode="MODAL"
        />
      </WhitePaddedView>
      {accommodationTypedForm}
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

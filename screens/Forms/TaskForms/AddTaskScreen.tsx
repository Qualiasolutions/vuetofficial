import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  periodFieldTypes,
  taskBottomFieldTypes,
  taskMiddleFieldTypes,
  taskTopFieldTypes
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
import { useCreateTaskMutation } from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import RadioInput from 'components/forms/components/RadioInput';
import useGetUserDetails from 'hooks/useGetUserDetails';
import useColouredHeader from 'headers/hooks/useColouredHeader';
import { useCreatePeriodMutation } from 'reduxStore/services/api/period';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import hasAllRequired from 'components/forms/utils/hasAllRequired';

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

export default function AddTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddTask'>) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();
  const [formType, setFormType] = useState<AddTaskFormType>('TASK');

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createPeriod, createPeriodResult] = useCreatePeriodMutation();
  const isSubmitting =
    createTaskResult.isLoading || createPeriodResult.isLoading;

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
  const [periodFieldValues, setPeriodFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const taskTopFields = taskTopFieldTypes();
  const taskMiddleFields = taskMiddleFieldTypes();
  const taskBottomFields = taskBottomFieldTypes();
  const periodFields = periodFieldTypes();

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

      const initialMiddleFields = createInitialObject(
        taskMiddleFields,
        userDetails,
        {
          start_datetime: defaultStartTime,
          end_datetime: defaultEndTime,
          recurrence: null
        }
      );
      setTaskMiddleFieldValues(initialMiddleFields);

      const initialBottomFields = createInitialObject(
        taskBottomFields,
        userDetails
      );
      setTaskBottomFieldValues(initialBottomFields);

      const initialPeriodFields = createInitialObject(
        periodFields,
        userDetails,
        { reminder_timedelta: '14 days, 0:00:00' }
      );
      setPeriodFieldValues(initialPeriodFields);

      setResetState(() => () => {
        setPeriodFieldValues(initialPeriodFields);
        setTaskTopFieldValues(initialTopFields);
        setTaskMiddleFieldValues(initialMiddleFields);
        setTaskBottomFieldValues(initialBottomFields);
      });

      setLoadedFields(true);
    }
  }, [userDetails, formType]);

  const hasRequired = useMemo(() => {
    if (formType === 'DUE_DATE') {
      return hasAllRequired(periodFieldValues, periodFields);
    } else {
      return (
        hasAllRequired(taskTopFieldValues, taskTopFields) &&
        hasAllRequired(taskMiddleFieldValues, taskMiddleFields) &&
        hasAllRequired(taskBottomFieldValues, taskBottomFields)
      );
    }
  }, [
    taskTopFieldValues,
    taskMiddleFields,
    taskBottomFieldValues,
    periodFieldValues
  ]);

  useEffect(() => {
    if (createTaskResult.isSuccess) {
      Toast.show({
        type: 'success',
        text1: t('screens.addTask.createSuccess')
      });
      resetState();
    } else if (createTaskResult.isError) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
      console.log(createTaskResult.error);
    }
  }, [createTaskResult]);

  useEffect(() => {
    if (createPeriodResult.isSuccess) {
      Toast.show({
        type: 'success',
        text1: t('screens.addTask.createSuccess')
      });
      resetState();
    } else if (createPeriodResult.isError) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
      console.log(createPeriodResult.error);
    }
  }, [createPeriodResult]);

  const submitForm = () => {
    if (formType === 'DUE_DATE') {
      const parsedPeriodFieldValues = parseFormValues(
        periodFieldValues,
        periodFields
      );
      const parsedFieldValues = {
        ...parsedPeriodFieldValues,
        end_date: parsedPeriodFieldValues.start_date,
        resourcetype: 'FixedPeriod'
      };

      createPeriod(parsedFieldValues);
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

      const parsedFieldValues = {
        ...parsedTopFieldValues,
        ...parsedMiddleFieldValues,
        ...parsedBottomFieldValues,
        type: formType,
        resourcetype: 'FixedTask'
      };

      createTask(parsedFieldValues);
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
              fields={periodFields}
              formValues={periodFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setPeriodFieldValues(values);
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
          <PaddedSpinner
            spinnerColor="buttonDefault"
            style={{ marginTop: 20 }}
          />
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
  }
});

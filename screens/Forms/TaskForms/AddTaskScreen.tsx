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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentPaddedView,
  TransparentView,
  WhitePaddedView,
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
  const [resetState, setResetState] = useState<() => void>(() => () => { });

  const taskTopFields = taskTopFieldTypes();
  const taskMiddleFields = taskMiddleFieldTypes();
  const taskBottomFields = taskBottomFieldTypes();
  const periodFields = periodFieldTypes();

  useEffect(() => {
    if (userDetails) {
      const initialTopFields = createInitialObject(taskTopFields, userDetails);
      setTaskTopFieldValues(initialTopFields);

      const initialMiddleFields = createInitialObject(
        taskMiddleFields,
        userDetails, {
        duration_minutes: formType === 'TASK' ? 15 : 60,
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

  const hasAllRequired = useMemo(() => {
    if (formType === 'DUE_DATE') {
      for (const fieldName in periodFields) {
        if (periodFields[fieldName].required && !periodFieldValues[fieldName]) {
          return false;
        }
      }
      return true;
    }

    for (const fieldName in taskTopFields) {
      if (taskTopFields[fieldName].required && !taskTopFieldValues[fieldName]) {
        return false;
      }
    }
    const middleFields = taskMiddleFields;
    const middleFieldValues = taskMiddleFieldValues;
    for (const fieldName in middleFields) {
      if (middleFields[fieldName].required && !middleFieldValues[fieldName]) {
        return false;
      }
    }
    for (const fieldName in taskBottomFields) {
      if (
        taskBottomFields[fieldName].required &&
        !taskBottomFieldValues[fieldName]
      ) {
        return false;
      }
    }
    return true;
  }, [
    taskTopFieldValues,
    taskMiddleFields,
    taskBottomFieldValues
  ]);

  useEffect(() => {
    if (createTaskResult.isSuccess) {
      Toast.show({
        type: "success",
        text1: t('screens.addTask.createSuccess')
      })
      resetState();
    } else if (createTaskResult.isError) {
      Toast.show({
        type: "error",
        text1: t('common.genericError')
      })
      console.log(createTaskResult.error);
    }
  }, [createTaskResult]);

  useEffect(() => {
    if (createPeriodResult.isSuccess) {
      Toast.show({
        type: "success",
        text1: t('screens.addTask.createSuccess')
      })
      resetState();
    } else if (createPeriodResult.isError) {
      Toast.show({
        type: "error",
        text1: t('common.genericError')
      })
      console.log(createPeriodResult.error);
    }
  }, [createPeriodResult]);

  const submitForm = () => {
    let parsedFieldValues = {};
    if (formType === 'DUE_DATE') {
      const parsedPeriodFieldValues = parseFormValues(
        periodFieldValues,
        periodFields
      );
      parsedFieldValues = {
        ...parsedPeriodFieldValues,
        end_date: parsedPeriodFieldValues.start_date,
        resourcetype: 'FixedPeriod',
        entity: route.params.entityId
      };
    } else {
      const middleFieldValues = taskMiddleFieldValues;
      const middleFields = taskMiddleFields;

      const parsedTopFieldValues = parseFormValues(
        taskTopFieldValues,
        taskTopFields
      );
      const parsedMiddleFieldValues = parseFormValues(
        middleFieldValues,
        middleFields
      );
      const parsedBottomFieldValues = parseFormValues(
        taskBottomFieldValues,
        taskBottomFields
      );

      const endDatetime = new Date(
        middleFieldValues.start_datetime.getTime() +
        middleFieldValues.duration_minutes * 60000
      );

      parsedFieldValues = {
        ...parsedTopFieldValues,
        ...parsedMiddleFieldValues,
        ...parsedBottomFieldValues,
        end_datetime: endDatetime,
        type: formType,
        resourcetype: 'FixedTask',
        entity: route.params.entityId
      };
    }

    console.log(parsedFieldValues)

    if (formType === 'DUE_DATE') {
      createPeriod(parsedFieldValues);
    } else {
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
              disabled={!hasAllRequired}
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

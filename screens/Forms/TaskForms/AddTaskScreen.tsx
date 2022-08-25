import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Button, Text, useThemeColor } from 'components/Themed';
import {
  fixedTaskForm,
  flexibleTaskForm,
  taskBottomFieldTypes,
  taskOneOffMiddleFieldTypes,
  taskRecurrentMiddleFieldTypes,
  taskTopFieldTypes
} from './taskFormFieldTypes';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView, TransparentView, WhitePaddedView } from 'components/molecules/ViewComponents';
import TypedForm from 'components/forms/TypedForm';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { FieldValueTypes } from 'components/forms/types';
import { StyleSheet } from 'react-native';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { useCreateTaskMutation } from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import RadioInput from 'components/forms/components/RadioInput';

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
]
type AddTaskFormType = 'TASK' | 'APPOINTMENT' | 'DUE_DATE';

export default function AddTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddTask'>) {
  const { t } = useTranslation();
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);
  const [formType, setFormType] = useState<AddTaskFormType>('TASK');

  const [createTask, createTaskResult] = useCreateTaskMutation()
  const isSubmitting = createTaskResult.isLoading

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

  const fieldColor = useThemeColor({}, 'almostWhite')

  const taskTopFields = taskTopFieldTypes();
  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskTopFields)
  );

  const taskRecurrentMiddleFields = taskRecurrentMiddleFieldTypes();
  const [taskRecurrentMiddleFieldValues, setTaskRecurrentMiddleFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskRecurrentMiddleFields)
  );

  const taskOneOffMiddleFields = taskOneOffMiddleFieldTypes();
  const [taskOneOffMiddleFieldValues, setTaskOneOffMiddleFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskOneOffMiddleFields)
  );

  const taskBottomFields = taskBottomFieldTypes();
  const [taskBottomFieldValues, setTaskBottomFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskBottomFields)
  );

  const hasAllRequired = useMemo(() => {
    for (const fieldName in taskTopFields) {
      if (taskTopFields[fieldName].required && !taskTopFieldValues[fieldName]) {
        return false;
      }
    }
    const middleFields = (taskTopFieldValues.recurrence ? taskRecurrentMiddleFields : taskOneOffMiddleFields)
    const middleFieldValues = (taskTopFieldValues.recurrence ? taskRecurrentMiddleFieldValues : taskOneOffMiddleFieldValues)
    for (const fieldName in middleFields) {
      if (middleFields[fieldName].required && !middleFieldValues[fieldName]) {
        return false;
      }
    }
    for (const fieldName in taskBottomFields) {
      if (taskBottomFields[fieldName].required && !taskBottomFieldValues[fieldName]) {
        return false;
      }
    }
    return true;
  }, [
    taskTopFieldValues,
    taskOneOffMiddleFields,
    taskRecurrentMiddleFieldValues,
    taskBottomFieldValues
  ]);

  const submitForm = () => {
    const middleFieldValues = taskTopFieldValues.recurrence
      ? taskRecurrentMiddleFieldValues
      : taskOneOffMiddleFieldValues
    const middleFields = taskTopFieldValues.recurrence
      ? taskRecurrentMiddleFields
      : taskOneOffMiddleFields

    const parsedTopFieldValues = parseFormValues(taskTopFieldValues, taskTopFields)
    const parsedMiddleFieldValues = parseFormValues(middleFieldValues, middleFields)
    const parsedBottomFieldValues = parseFormValues(taskBottomFieldValues, taskBottomFields)

    const endDatetime = new Date(
      middleFieldValues.start_datetime.getTime()
      + taskTopFieldValues.duration_minutes * 60000
    )

    const body = {
      ...parsedTopFieldValues,
      ...parsedMiddleFieldValues,
      ...parsedBottomFieldValues,
      resourcetype: 'FixedTask', // TODO
      entity: route.params.entityId,
      end_datetime: endDatetime
    }
    console.log(body)
    createTask(body)
      .then((res) => {
        console.log(res)
        setCreateSuccessful(true)
      })
      .catch((err) => console.log(err))
  };

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        {createSuccessful ? (
          <Text>{t('screens.addTask.createSuccess')}</Text>
        ) : null}
        <WhitePaddedView style={styles.individualForm}>
          <RadioInput
            value={formType}
            permittedValues={formTypes}
            onValueChange={(value) => { setFormType(value.id as AddTaskFormType) }}
          />
          <TypedForm
            fields={taskTopFields}
            formValues={taskTopFieldValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setTaskTopFieldValues(values)
            }}
            inlineFields={true}
            fieldColor={fieldColor}
          />
        </WhitePaddedView>
        <WhitePaddedView style={styles.individualForm}>
          {
            taskTopFieldValues.recurrence
            ? (
              <TypedForm
                fields={taskRecurrentMiddleFields}
                formValues={taskRecurrentMiddleFieldValues}
                onFormValuesChange={(values: FieldValueTypes) => {
                  setTaskRecurrentMiddleFieldValues(values)
                }}
                inlineFields={true}
                fieldColor={fieldColor}
              />
            ) : (
              <TypedForm
                fields={taskOneOffMiddleFields}
                formValues={taskOneOffMiddleFieldValues}
                onFormValuesChange={(values: FieldValueTypes) => {
                  setTaskOneOffMiddleFieldValues(values)
                }}
                inlineFields={true}
                fieldColor={fieldColor}
              />
            )
          }
        </WhitePaddedView>
        <WhitePaddedView style={styles.individualForm}>
          <TypedForm
            fields={taskBottomFields}
            formValues={taskBottomFieldValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setTaskBottomFieldValues(values)
            }}
            inlineFields={true}
            fieldColor={fieldColor}
          />
        </WhitePaddedView>

        {isSubmitting
          ? <PaddedSpinner spinnerColor='buttonDefault' style={{ marginTop: 20 }}/>
          : (
            <TransparentPaddedView style={styles.bottomButtons}>
              <Button
                title={t('screens.addTask.createTask')}
                onPress={() => {
                  submitForm();
                }}
                disabled={!hasAllRequired}
              />
            </TransparentPaddedView>
          )
        }
      </TransparentView>

        
    </TransparentFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  individualForm: {
    marginBottom: 30,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    elevation: 3,
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    zIndex: -1,
    justifyContent: 'center'
  },
})
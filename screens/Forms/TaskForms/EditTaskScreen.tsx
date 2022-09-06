import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Button, Text, useThemeColor } from 'components/Themed';
import {
  taskBottomFieldTypes,
  taskOneOffMiddleFieldTypes,
  taskRecurrentMiddleFieldTypes,
  taskTopFieldTypes
} from './taskFormFieldTypes';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
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
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation
} from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { TaskResponseType } from 'types/tasks';
import dayjs from 'dayjs';
import { deepCopy } from 'utils/copy';

export default function EditTaskScreen({
  route,
  navigation
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const { t } = useTranslation();
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string>('');

  const [updateTask, updateTaskResult] = useUpdateTaskMutation();
  const [deleteTask, deleteTaskResult] = useDeleteTaskMutation();
  const isSubmitting = updateTaskResult.isLoading || deleteTaskResult.isLoading;

  useFocusEffect(
    useCallback(() => {
      setUpdateSuccessful(false);
    }, [])
  );

  const { data: userDetails } = useGetUserDetails();
  const {
    isLoading,
    data: allTasks,
    error
  } = useGetAllTasksQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [taskToEdit, setTaskToEdit] = useState<TaskResponseType | null>(null);
  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [taskRecurrentMiddleFieldValues, setTaskRecurrentMiddleFieldValues] =
    useState<FieldValueTypes>({});
  const [taskOneOffMiddleFieldValues, setTaskOneOffMiddleFieldValues] =
    useState<FieldValueTypes>({});
  const [taskBottomFieldValues, setTaskBottomFieldValues] =
    useState<FieldValueTypes>({});
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const taskTopFields = taskTopFieldTypes(true);
  const taskRecurrentMiddleFields = taskRecurrentMiddleFieldTypes(true);
  const taskOneOffMiddleFields = taskOneOffMiddleFieldTypes();
  const taskBottomFields = taskBottomFieldTypes();

  useEffect(() => {
    if (allTasks && userDetails) {
      const newTaskToEdit = deepCopy(allTasks.byId[route.params.taskId]);
      if (newTaskToEdit) {
        newTaskToEdit.duration_minutes = Math.round(
          (dayjs(newTaskToEdit.end_datetime).toDate().getTime() -
            dayjs(newTaskToEdit.start_datetime).toDate().getTime()) /
            (60 * 1000)
        );

        newTaskToEdit.recurrence = newTaskToEdit.recurrence
          ? newTaskToEdit.recurrence.recurrence
          : null;
        setTaskToEdit(newTaskToEdit);

        console.log(taskTopFields);
        const initialTopFields = createInitialObject(
          taskTopFields,
          userDetails,
          newTaskToEdit
        );
        setTaskTopFieldValues(initialTopFields);

        const initialRecurrentMiddleFields = createInitialObject(
          taskRecurrentMiddleFields,
          userDetails,
          newTaskToEdit
        );
        setTaskRecurrentMiddleFieldValues(initialRecurrentMiddleFields);

        const initialOneOffMiddleFields = createInitialObject(
          taskOneOffMiddleFields,
          userDetails,
          newTaskToEdit
        );
        setTaskOneOffMiddleFieldValues(initialOneOffMiddleFields);

        const initialBottomFields = createInitialObject(
          taskBottomFields,
          userDetails,
          newTaskToEdit
        );
        setTaskBottomFieldValues(initialBottomFields);

        setResetState(() => () => {
          setTaskTopFieldValues(initialTopFields);
          setTaskRecurrentMiddleFieldValues(initialRecurrentMiddleFields);
          setTaskOneOffMiddleFieldValues(initialOneOffMiddleFields);
          setTaskBottomFieldValues(initialBottomFields);
        });
      }
    }
  }, [allTasks, userDetails, route.params.taskId]);

  const hasAllRequired = useMemo(() => {
    for (const fieldName in taskTopFields) {
      if (taskTopFields[fieldName].required && !taskTopFieldValues[fieldName]) {
        return false;
      }
    }
    const middleFields = taskTopFieldValues.recurrence
      ? taskRecurrentMiddleFields
      : taskOneOffMiddleFields;
    const middleFieldValues = taskTopFieldValues.recurrence
      ? taskRecurrentMiddleFieldValues
      : taskOneOffMiddleFieldValues;
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
    taskOneOffMiddleFields,
    taskRecurrentMiddleFieldValues,
    taskBottomFieldValues
  ]);

  useEffect(() => {
    if (updateTaskResult.isSuccess) {
      setUpdateError('');
      setUpdateSuccessful(true);
      resetState();
    } else if (updateTaskResult.isError) {
      setUpdateError('An unexpected error occurred');
      console.log(updateTaskResult.error);
    }
  }, [updateTaskResult]);

  useEffect(() => {
    if (deleteTaskResult.isSuccess) {
      navigation.goBack();
    } else if (deleteTaskResult.isError) {
      setUpdateError('An unexpected error occurred');
      console.log(deleteTaskResult.error);
    }
  }, [deleteTaskResult]);

  const submitUpdateForm = () => {
    if (taskToEdit) {
      const middleFieldValues = taskTopFieldValues.recurrence
        ? taskRecurrentMiddleFieldValues
        : taskOneOffMiddleFieldValues;
      const middleFields = taskTopFieldValues.recurrence
        ? taskRecurrentMiddleFields
        : taskOneOffMiddleFields;

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
          taskTopFieldValues.duration_minutes * 60000
      );

      const body = {
        ...parsedTopFieldValues,
        ...parsedMiddleFieldValues,
        ...parsedBottomFieldValues,
        resourcetype: 'FixedTask' as 'FixedTask' | 'FlexibleTask', // TODO
        id: taskToEdit.id,
        entity: taskToEdit.entity,
        end_datetime: endDatetime
      };

      if ((body as any).recurrence) {
        delete (body as any).recurrence;
      }

      console.log(body);
      updateTask(body);
    }
  };

  if (!taskToEdit) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        <WhitePaddedView style={styles.individualForm}>
          {updateSuccessful ? (
            <Text>{t('screens.editTask.updateSuccess')}</Text>
          ) : null}
          {updateError ? <Text>{updateError}</Text> : null}
          <TypedForm
            fields={taskTopFields}
            formValues={taskTopFieldValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setTaskTopFieldValues(values);
              setUpdateError('');
              setUpdateSuccessful(false);
            }}
            inlineFields={true}
            fieldColor={fieldColor}
          />
        </WhitePaddedView>
        <WhitePaddedView style={styles.individualForm}>
          {taskTopFieldValues.recurrence ? (
            <TypedForm
              fields={taskRecurrentMiddleFields}
              formValues={taskRecurrentMiddleFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskRecurrentMiddleFieldValues(values);
                setUpdateError('');
                setUpdateSuccessful(false);
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          ) : (
            <TypedForm
              fields={taskOneOffMiddleFields}
              formValues={taskOneOffMiddleFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskOneOffMiddleFieldValues(values);
                setUpdateError('');
                setUpdateSuccessful(false);
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          )}
        </WhitePaddedView>
        <WhitePaddedView style={styles.individualForm}>
          <TypedForm
            fields={taskBottomFields}
            formValues={taskBottomFieldValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setTaskBottomFieldValues(values);
              setUpdateError('');
              setUpdateSuccessful(false);
            }}
            inlineFields={true}
            fieldColor={fieldColor}
          />
        </WhitePaddedView>

        {isSubmitting ? (
          <PaddedSpinner
            spinnerColor="buttonDefault"
            style={{ marginTop: 20 }}
          />
        ) : (
          <TransparentPaddedView style={styles.bottomButtons}>
            <Button
              title={t('screens.editTask.updateTask')}
              onPress={() => {
                submitUpdateForm();
              }}
              disabled={!hasAllRequired}
              style={styles.bottomButton}
            />
            <Button
              title={t('screens.editTask.deleteTask')}
              onPress={() => {
                deleteTask(taskToEdit);
              }}
              disabled={!hasAllRequired}
              style={styles.bottomButton}
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
  individualForm: {
    marginBottom: 30,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    elevation: 3
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    zIndex: -1,
    justifyContent: 'center'
  },
  bottomButton: {
    flex: 1,
    margin: 5
  }
});

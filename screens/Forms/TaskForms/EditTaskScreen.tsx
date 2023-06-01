import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  useTaskBottomFieldTypes,
  useTaskMiddleFieldTypes,
  useTaskTopFieldTypes
} from './taskFormFieldTypes';
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
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation
} from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { FixedTaskResponseType } from 'types/tasks';
import useEntityHeader from 'headers/hooks/useEntityHeader';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

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
  bottomButton: {
    flex: 1,
    margin: 5
  }
});

export default function EditTaskScreen({
  route,
  navigation
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const { t } = useTranslation();

  const [updateTask, updateTaskResult] = useUpdateTaskMutation();
  const [deleteTask, deleteTaskResult] = useDeleteTaskMutation();
  const isSubmitting = updateTaskResult.isLoading || deleteTaskResult.isLoading;

  const { data: userDetails } = useGetUserDetails();
  const {
    isLoading,
    data: allTasks,
    error
  } = useGetAllTasksQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [taskToEdit, setTaskToEdit] = useState<FixedTaskResponseType | null>(
    null
  );
  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [taskMiddleFieldValues, setTaskMiddleFieldValues] =
    useState<FieldValueTypes>({});
  const [taskBottomFieldValues, setTaskBottomFieldValues] =
    useState<FieldValueTypes>({});
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const taskTopFields = useTaskTopFieldTypes();
  const taskMiddleFields = useTaskMiddleFieldTypes(
    !!(taskToEdit && taskToEdit.recurrence)
  );
  const taskBottomFields = useTaskBottomFieldTypes();

  useEffect(() => {
    if (allTasks && userDetails) {
      const oldTask = allTasks.byId[route.params.taskId];
      const newTaskToEdit = {
        ...oldTask,
        tags: {
          entities: oldTask.entities
        }
      };
      if (newTaskToEdit) {
        setTaskToEdit(newTaskToEdit);

        const initialTopFields = createInitialObject(
          taskTopFields,
          userDetails,
          newTaskToEdit
        );
        setTaskTopFieldValues(initialTopFields);

        const initialMiddleFields = createInitialObject(
          taskMiddleFields,
          userDetails,
          newTaskToEdit
        );
        setTaskMiddleFieldValues(initialMiddleFields);

        const initialBottomFields = createInitialObject(
          taskBottomFields,
          userDetails,
          newTaskToEdit
        );
        setTaskBottomFieldValues(initialBottomFields);

        setResetState(() => () => {
          setTaskTopFieldValues(initialTopFields);
          setTaskMiddleFieldValues(initialMiddleFields);
          setTaskBottomFieldValues(initialBottomFields);
        });
      }
    }
  }, [allTasks, userDetails, route.params.taskId]);

  useEntityHeader(0, false, t('pageTitles.editTask'));

  const hasAllRequired = useMemo(() => {
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
    taskBottomFields,
    taskBottomFieldValues,
    taskMiddleFields,
    taskMiddleFieldValues,
    taskTopFields,
    taskTopFieldValues
  ]);

  useEffect(() => {
    if (updateTaskResult.isSuccess) {
      Toast.show({
        type: 'success',
        text1: t('screens.editTask.updateSuccess')
      });
      resetState();
    } else if (updateTaskResult.isError) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
    }
  }, [updateTaskResult, resetState, t]);

  useEffect(() => {
    if (deleteTaskResult.isSuccess) {
      navigation.goBack();
    } else if (deleteTaskResult.isError) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
    }
  }, [deleteTaskResult, navigation, t]);

  const submitUpdateForm = () => {
    if (taskToEdit) {
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

      const body = {
        ...parsedTopFieldValues,
        ...parsedMiddleFieldValues,
        ...parsedBottomFieldValues,
        resourcetype: 'FixedTask' as 'FixedTask',
        id: taskToEdit.id
      };

      if (Object.keys(body as any).includes('recurrence')) {
        delete (body as any).recurrence;
      }

      updateTask(body);
    }
  };

  if (!taskToEdit) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        <TransparentView>
          <TypedForm
            fields={taskTopFields}
            formValues={taskTopFieldValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setTaskTopFieldValues(values);
            }}
            inlineFields={true}
            fieldColor={fieldColor}
          />
        </TransparentView>
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

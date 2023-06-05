import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import {
  useDueDateFieldTypes,
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
import { DueDateResponseType, FixedTaskResponseType } from 'types/tasks';
import useEntityHeader from 'headers/hooks/useEntityHeader';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import hasAllRequired from 'components/forms/utils/hasAllRequired';

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
  },
  spinner: { marginTop: 20 }
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
  const { data: allTasks } = useGetAllTasksQuery(null as any, {
    skip: !userDetails?.id
  });

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [taskToEdit, setTaskToEdit] = useState<
    FixedTaskResponseType | DueDateResponseType | null
  >(null);
  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [taskMiddleFieldValues, setTaskMiddleFieldValues] =
    useState<FieldValueTypes>({});
  const [taskBottomFieldValues, setTaskBottomFieldValues] =
    useState<FieldValueTypes>({});

  const [dueDateFieldValues, setDueDateFieldValues] = useState<FieldValueTypes>(
    {}
  );
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const taskTopFields = useTaskTopFieldTypes(true, taskToEdit?.hidden_tag);
  const taskMiddleFields = useTaskMiddleFieldTypes(
    true,
    !!(taskToEdit && taskToEdit.recurrence)
  );
  const taskBottomFields = useTaskBottomFieldTypes();
  const dueDateFields = useDueDateFieldTypes(true, taskToEdit?.hidden_tag);

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

        const initialDueDateFields = createInitialObject(
          dueDateFields,
          userDetails,
          newTaskToEdit
        );
        setDueDateFieldValues(initialDueDateFields);

        setResetState(() => () => {
          setTaskTopFieldValues(initialTopFields);
          setTaskMiddleFieldValues(initialMiddleFields);
          setTaskBottomFieldValues(initialBottomFields);
          setDueDateFieldValues(initialDueDateFields);
        });
      }
    }
  }, [
    allTasks,
    userDetails,
    route.params.taskId,
    taskBottomFields,
    taskMiddleFields,
    taskTopFields,
    dueDateFields
  ]);

  useEntityHeader(0, false, t('pageTitles.editTask'));

  const hasRequired = useMemo(() => {
    if (taskToEdit?.resourcetype === 'FixedTask') {
      return (
        hasAllRequired(taskTopFieldValues, taskTopFields) &&
        hasAllRequired(taskMiddleFieldValues, taskMiddleFields) &&
        hasAllRequired(taskBottomFieldValues, taskBottomFields)
      );
    } else {
      return hasAllRequired(dueDateFieldValues, dueDateFields);
    }
  }, [
    taskTopFieldValues,
    taskMiddleFieldValues,
    taskBottomFieldValues,
    taskTopFields,
    taskMiddleFields,
    taskBottomFields,
    taskToEdit,
    dueDateFields,
    dueDateFieldValues
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
      if (taskToEdit.resourcetype === 'FixedTask') {
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
      } else {
        const parsedDueDateFieldValues = parseFormValues(
          dueDateFieldValues,
          dueDateFields
        );

        const body = {
          ...parsedDueDateFieldValues,
          resourcetype: 'DueDate' as 'DueDate',
          id: taskToEdit.id
        };
        if (Object.keys(body as any).includes('recurrence')) {
          delete (body as any).recurrence;
        }

        updateTask(body);
      }
    }
  };

  if (!taskToEdit) {
    return <FullPageSpinner />;
  }

  const formFields =
    taskToEdit.resourcetype === 'FixedTask' ? (
      <>
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
      </>
    ) : (
      <TransparentView>
        <TypedForm
          fields={dueDateFields}
          formValues={dueDateFieldValues}
          onFormValuesChange={(values: FieldValueTypes) => {
            setDueDateFieldValues(values);
          }}
          inlineFields={true}
          fieldColor={fieldColor}
        />
      </TransparentView>
    );

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        {formFields}
        {isSubmitting ? (
          <PaddedSpinner spinnerColor="buttonDefault" style={styles.spinner} />
        ) : (
          <TransparentPaddedView style={styles.bottomButtons}>
            <Button
              title={t('screens.editTask.updateTask')}
              onPress={() => {
                submitUpdateForm();
              }}
              disabled={!hasRequired}
              style={styles.bottomButton}
            />
            <Button
              title={t('screens.editTask.deleteTask')}
              onPress={() => {
                deleteTask(taskToEdit);
              }}
              disabled={!hasRequired}
              style={styles.bottomButton}
            />
          </TransparentPaddedView>
        )}
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}

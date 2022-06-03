import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { fixedTaskForm } from './taskFormFieldTypes';
import { formStyles } from '../formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { deepCopy } from 'utils/copy';
import { FormFieldTypes } from 'components/forms/formFieldTypes';
import DeleteSuccess from '../components/DeleteSuccess';
import {
  useGetUserDetailsQuery,
} from 'reduxStore/services/api/api';
import { useDeleteTaskMutation, useGetAllTasksQuery, useUpdateTaskMutation } from 'reduxStore/services/api/tasks';

export default function EditTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const { data: userDetails } = useGetUserDetailsQuery();

  const {
    isLoading,
    data: allTasks,
    error,
  } = useGetAllTasksQuery(userDetails?.user_id || -1);

  if (isLoading || !allTasks) {
    return null;
  }

  if (error) {
    return <Text>An unexpected error ocurred</Text>;
  }

  const [deleteSuccessful, setDeleteSuccessful] = useState<boolean>(false);
  const [updatedSuccessfully, setUpdatedSuccessfully] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setDeleteSuccessful(false);
      setUpdatedSuccessfully(false);
    }, [])
  );

  if (deleteSuccessful) {
    return <DeleteSuccess name="task"></DeleteSuccess>;
  }

  if (route.params?.taskId && allTasks.byId[route.params.taskId]) {
    const taskToEdit = allTasks.byId[route.params.taskId];
    const formFields = deepCopy<FormFieldTypes>(fixedTaskForm);

    for (const fieldName in fixedTaskForm) {
      if (fieldName in taskToEdit) {
        formFields[fieldName].initialValue = taskToEdit[fieldName] || null;
      }
    }

    console.log(formFields);

    return (
      <SafeAreaView style={formStyles.container}>
        <View style={formStyles.container}>
          <Text style={formStyles.title}>Edit task</Text>
          {updatedSuccessfully ? <Text>Successfully updated task</Text> : null}
          <RTKForm
            fields={formFields}
            methodHooks={{
              'PATCH': useUpdateTaskMutation,
              'DELETE': useDeleteTaskMutation
            }}
            formType="UPDATE"
            extraFields={{ resourcetype: 'FixedTask' }}
            onSubmitSuccess={() => setUpdatedSuccessfully(true)}
            onDeleteSuccess={() => setDeleteSuccessful(true)}
            onValueChange={() => setUpdatedSuccessfully(false)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

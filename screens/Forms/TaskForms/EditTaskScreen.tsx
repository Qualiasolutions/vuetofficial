import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { fixedTaskForm } from './taskFormFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { TaskResponseType } from 'types/tasks';
import { deepCopy } from 'utils/copy';
import { FormFieldTypes } from 'components/forms/formFieldTypes';
import DeleteSuccess from '../components/DeleteSuccess';
import { useGetAllTasksQuery } from 'reduxStore/services/api';

export default function EditTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const {
    isLoading,
    data: allTasks,
    error,
    refetch: refetchTasks
  } = useGetAllTasksQuery();

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

  const updateTasks = (res: TaskResponseType) => {
    refetchTasks();
    setUpdatedSuccessfully(true);
  };

  const onDeleteSuccess = (res: TaskResponseType) => {
    refetchTasks();
    setDeleteSuccessful(true);
  };

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
          <GenericForm
            fields={formFields}
            url={makeApiUrl(`/core/task/${taskToEdit.id}/`)}
            formType="UPDATE"
            extraFields={{ resourcetype: 'FixedTask' }}
            onSubmitSuccess={updateTasks}
            onDeleteSuccess={onDeleteSuccess}
            onValueChange={() => setUpdatedSuccessfully(false)}
          ></GenericForm>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

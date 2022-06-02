import { Text, View } from 'components/Themed';
import { completionFormFieldTypes } from './taskCompletionFormFieldTypes';
import { formStyles } from '../../../screens/Forms/formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { TaskParsedType } from 'types/tasks';
import { useGetAllTasksQuery, useGetUserDetailsQuery } from 'reduxStore/services/api/api';

export default function TaskCompletionForm({
  task,
  title = ''
}: {
  task: TaskParsedType;
  title?: string;
}) {
  const { data: userDetails } = useGetUserDetailsQuery()

  const {
    isLoading,
    data: allTasks,
    error,
    refetch: refetchTasks
  } = useGetAllTasksQuery(userDetails?.user_id || -1);
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);

  if (isLoading || !allTasks) {
    return null;
  }

  if (error) {
    return <Text>An unexpected error ocurred</Text>;
  }

  const updateTasks = () => {
    refetchTasks();
    setCreateSuccessful(true);
  };

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

  const permittedTaskForms = ['BookMOTTask'];
  if (task.resourcetype && permittedTaskForms.includes(task.resourcetype)) {
    return (
      <SafeAreaView style={formStyles.container}>
        <View style={formStyles.container}>
          {title ? <Text style={formStyles.title}>{title}</Text> : null}
          {createSuccessful ? (
            <Text>Successfully created new {task.resourcetype}</Text>
          ) : null}
          <GenericForm
            fields={completionFormFieldTypes[task.resourcetype]}
            url={makeApiUrl(`/core/task_completion_form/`)}
            formType="CREATE"
            extraFields={{
              resourcetype: `${task.resourcetype}CompletionForm`,
              task: task.id
            }}
            onSubmitSuccess={updateTasks}
            onValueChange={() => setCreateSuccessful(false)}
            clearOnSubmit={true}
            submitText="Mark complete"
          ></GenericForm>
        </View>
      </SafeAreaView>
    );
  }
  return null;
}

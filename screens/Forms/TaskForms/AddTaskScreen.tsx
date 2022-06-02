import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { fixedTaskForm, flexibleTaskForm } from './taskFormFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { TaskResponseType } from 'types/tasks';
import { useGetAllTasksQuery } from 'reduxStore/services/api';

export default function AddTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddTask'>) {
  const {
    isLoading,
    data: allTasks,
    error,
    refetch: refetchTasks
  } = useGetAllTasksQuery();
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);

  if (isLoading || !allTasks) {
    return null;
  }

  if (error) {
    return <Text>An unexpected error ocurred</Text>;
  }

  const updateTasks = (res: TaskResponseType) => {
    refetchTasks();
    setCreateSuccessful(true);
  };

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

  return (
    <SafeAreaView style={formStyles.container}>
      <View style={formStyles.container}>
        <Text style={formStyles.title}>New task</Text>
        {createSuccessful ? <Text>Successfully created new task</Text> : null}
        <GenericForm
          fields={fixedTaskForm}
          url={makeApiUrl(`/core/task/`)}
          formType="CREATE"
          extraFields={{
            entity: route.params?.entityId,
            resourcetype: 'FixedTask'
          }}
          onSubmitSuccess={updateTasks}
          onValueChange={() => setCreateSuccessful(false)}
          clearOnSubmit={true}
        ></GenericForm>
      </View>
    </SafeAreaView>
  );
}

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { fixedTaskForm, flexibleTaskForm } from './taskFormFieldTypes';
import { formStyles } from '../formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { TaskResponseType } from 'types/tasks';
import {
  useGetUserDetailsQuery,
} from 'reduxStore/services/api/api';
import {
  useCreateTaskMutation,
  useGetAllTasksQuery
} from 'reduxStore/services/api/tasks';

import { useTranslation } from 'react-i18next';

export default function AddTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddTask'>) {
  const { data: userDetails } = useGetUserDetailsQuery();
  const { t } = useTranslation();
  const {
    isLoading,
    data: allTasks,
    error,
    refetch: refetchTasks
  } = useGetAllTasksQuery(userDetails?.user_id || -1);
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);

  const fixedTaskFormFields = fixedTaskForm()

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
        <Text style={formStyles.title}>{t("screens.addTask.title")}</Text>
        {createSuccessful ? <Text>{t("screens.addTask.createSuccess")}</Text> : null}
        <RTKForm
          fields={fixedTaskFormFields}
          methodHooks={{
            POST: useCreateTaskMutation
          }}
          formType="CREATE"
          extraFields={{
            entity: route.params?.entityId,
            resourcetype: 'FixedTask'
          }}
          onSubmitSuccess={updateTasks}
          onValueChange={() => setCreateSuccessful(false)}
          clearOnSubmit={true}
        />
      </View>
    </SafeAreaView>
  );
}

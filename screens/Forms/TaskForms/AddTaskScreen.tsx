import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, View } from 'components/Themed';
import { fixedTaskForm, flexibleTaskForm } from './taskFormFieldTypes';
import { formStyles } from '../formStyles';
import GenericForm from 'components/forms/GenericForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { makeApiUrl } from 'utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { TaskResponseType } from 'types/tasks';
import { selectAllTasks } from 'reduxStore/slices/tasks/selectors';
import { setAllTasks } from 'reduxStore/slices/tasks/actions';

export default function AddTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddTask'>) {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectAllTasks);
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false)

  const updateTasks = (res: TaskResponseType) => {
    dispatch(setAllTasks([...Object.values(allTasks.byId), res]));
    setCreateSuccessful(true)
  };

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false)
    }, [])
  )

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
            entity: route.params.entityId,
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

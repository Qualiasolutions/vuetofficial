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
import { deepCopy } from 'utils/copy';
import { FormFieldTypes } from '../formFieldTypes';
import DeleteSuccess from '../components/DeleteSuccess';

export default function EditTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectAllTasks);
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
    dispatch(
      setAllTasks([
        ...Object.values({
          ...allTasks.byId,
          [route.params.taskId]: res
        })
      ])
    );
    setUpdatedSuccessfully(true);
  };

  const onDeleteSuccess = (res: TaskResponseType) => {
    dispatch(
      setAllTasks([
        ...Object.values({
          ...allTasks.byId
        }).filter((entity) => entity.id !== route.params.taskId)
      ])
    );

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

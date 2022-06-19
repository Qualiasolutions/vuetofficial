import { Text, View } from 'components/Themed';
import { completionFormFieldTypes } from './taskCompletionFormFieldTypes';
import { formStyles } from '../../../screens/Forms/formStyles';
import RTKForm from 'components/forms/RTKForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScheduledTaskParsedType } from 'types/tasks';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

export default function TaskCompletionForm({
  task,
  title = '',
  onSubmitSuccess = () => {}
}: {
  task: ScheduledTaskParsedType;
  title?: string;
  onSubmitSuccess?: Function;
}) {
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);

  const updateTasks = () => {
    setCreateSuccessful(true);
    onSubmitSuccess();
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
          <RTKForm
            fields={completionFormFieldTypes[task.resourcetype]}
            methodHooks={{
              POST: useCreateTaskCompletionFormMutation
            }}
            formType="CREATE"
            extraFields={{
              resourcetype: `${task.resourcetype}CompletionForm`,
              recurrence_index: task.recurrence_index,
              task: task.id
            }}
            onSubmitSuccess={updateTasks}
            onValueChange={() => setCreateSuccessful(false)}
            clearOnSubmit={true}
            submitText="Mark complete"
          />
        </View>
      </SafeAreaView>
    );
  }
  return null;
}

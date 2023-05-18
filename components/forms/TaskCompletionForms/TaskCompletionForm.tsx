import { Text, View } from 'components/Themed';
import { completionFormFieldTypes } from './taskCompletionFormFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';
import { Modal } from 'components/molecules/Modals';
import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';

export default function TaskCompletionForm({
  task,
  title = '',
  onSubmitSuccess = () => { },
  onRequestClose = () => { }
}: {
  task: MinimalScheduledTask;
  title?: string;
  onSubmitSuccess?: Function;
  onRequestClose?: () => void;
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
      <Modal onRequestClose={onRequestClose || (() => { })}>
        <View>
          {title ? <Text>{title}</Text> : null}
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
          // inlineFields={true}
          />
        </View>
      </Modal>
    );
  }
  return null;
}

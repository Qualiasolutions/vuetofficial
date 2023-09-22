import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import useEntityHeader from 'headers/hooks/useEntityHeader';
import GenericTaskForm from 'components/forms/GenericTaskForm';
import { useSelector } from 'react-redux';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import useDefaultTaskValues from 'hooks/useDefaultTaskValues';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  }
});

export default function EditTaskScreen({
  route,
  navigation
}: NativeStackScreenProps<RootTabParamList, 'EditTask'>) {
  const { t } = useTranslation();
  const { taskId, recurrenceIndex } = route.params;

  const taskObj = useSelector(selectTaskById(taskId));
  const taskToEditType = taskObj?.type;
  const defaultValues = useDefaultTaskValues(taskId, recurrenceIndex);

  useEntityHeader(0, false, t('pageTitles.editTask'));

  if (!(defaultValues && Object.keys(defaultValues).length > 0)) {
    return <FullPageSpinner />;
  }

  if (!taskToEditType) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        <GenericTaskForm
          type={taskToEditType}
          isEdit={true}
          defaults={defaultValues}
          taskId={route.params.taskId}
          recurrenceIndex={route.params.recurrenceIndex}
          recurrenceOverwrite={route.params.recurrenceOverwrite}
          onSuccess={() => {
            navigation.goBack();
          }}
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}

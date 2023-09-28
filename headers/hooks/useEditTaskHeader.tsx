import { useLayoutEffect } from 'react';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import { Text } from 'components/Themed';
import { BackOnlyHeaderWithSafeArea } from 'headers/BackOnlyHeader';

export default function useEditTaskHeader({
  taskId,
  recurrenceIndex
}: {
  taskId: number;
  recurrenceIndex?: number;
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const task = useSelector(selectTaskById(taskId));
  const scheduledTask = useSelector(
    selectScheduledTask({ id: taskId, recurrenceIndex })
  );

  useLayoutEffect(() => {
    console.log('task');
    console.log(task);
    if (task) {
      const headerRight = <Text>{task.title}</Text>;
      const header = (props: NativeStackHeaderProps) => (
        <BackOnlyHeaderWithSafeArea headerRight={headerRight} {...props} />
      );

      const options: Partial<NativeStackNavigationOptions> = {
        title: task.title,
        header,
        headerShown: true
      };

      navigation.setOptions(options);
    }
  }, [task, navigation, route]);
}

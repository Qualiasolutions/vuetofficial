import Task from 'components/calendars/TaskCalendar/components/Task';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectRoutineById } from 'reduxStore/slices/routines/selectors';
import { selectTasksForRoutineForDate } from 'reduxStore/slices/tasks/selectors';
import { RootTabScreenProps } from 'types/base';

const styles = StyleSheet.create({
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 10 }
});

type RoutineTasksScreenProps = RootTabScreenProps<'RoutineTasks'>;
export default function RoutineTasksScreen({ route }: RoutineTasksScreenProps) {
  const { id, date } = route.params;
  const routine = useSelector(selectRoutineById(id));
  const routineTasks = useSelector(selectTasksForRoutineForDate(id, date));

  if (!routine || !routineTasks) {
    return null;
  }

  const routineTaskViews = routineTasks.map((task) => (
    <Task task={task} date={date} key={task.id} />
  ));

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        <Text style={styles.title}>
          {routine.name} {date}
        </Text>
        {routineTaskViews}
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}

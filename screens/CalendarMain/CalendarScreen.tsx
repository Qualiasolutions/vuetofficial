import Calendar from 'components/calendars/TaskCalendar';
import SideDrawerButton from 'components/molecules/SideDrawerButton';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import {
  selectFilteredScheduledEntityIdsByDate,
  selectFilteredScheduledTaskIdsByDate
} from 'reduxStore/slices/tasks/selectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    height: '100%'
  }
});

export default function CalendarScreen() {
  const filteredTasks = useSelector(selectFilteredScheduledTaskIdsByDate);
  const filteredEntities = useSelector(selectFilteredScheduledEntityIdsByDate);
  const { isLoading } = useGetAllScheduledTasksQuery(null as any);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SideDrawerButton />
      <Calendar
        filteredTasks={filteredTasks}
        filteredEntities={filteredEntities}
        showFilters={true}
      />
    </SafeAreaView>
  );
}

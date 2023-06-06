import Calendar from 'components/calendars/TaskCalendar';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { selectFilteredScheduledTaskIdsByDate } from 'reduxStore/slices/calendars/selectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    height: '100%'
  }
});

export default function CalendarScreen() {
  const filteredTasks = useSelector(selectFilteredScheduledTaskIdsByDate);
  const { isLoading } = useGetAllScheduledTasksQuery();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        fullPage={true}
        filteredTasks={filteredTasks}
        showFilters={true}
      />
    </SafeAreaView>
  );
}

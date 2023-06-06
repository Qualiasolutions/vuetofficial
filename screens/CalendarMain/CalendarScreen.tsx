import Calendar from 'components/calendars/TaskCalendar';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
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

  return (
    <SafeAreaView style={styles.container}>
      <Calendar fullPage={true} filteredTasks={filteredTasks} />
    </SafeAreaView>
  );
}

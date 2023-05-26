import Calendar from 'components/calendars/TaskCalendar';
import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectFilteredEntities,
  selectFilteredUsers
} from 'reduxStore/slices/calendars/selectors';
import { ParsedPeriod } from 'types/periods';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    height: '100%'
  }
});

export default function CalendarScreen() {
  const filteredUsers = useSelector(selectFilteredUsers);
  const filteredEntities = useSelector(selectFilteredEntities);
  const userFilter = (task: MinimalScheduledTask | ParsedPeriod) => {
    return filteredUsers && filteredUsers.length > 0
      ? filteredUsers.some((userId) => task.members.includes(userId))
      : true;
  };

  const entityFilter = (task: MinimalScheduledTask | ParsedPeriod) => {
    return filteredEntities && filteredEntities.length > 0
      ? filteredEntities.some((entityId) => task.entities.includes(entityId))
      : true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        taskFilters={[userFilter, entityFilter]}
        periodFilters={[userFilter, entityFilter]}
        fullPage={true}
      />
    </SafeAreaView>
  );
}

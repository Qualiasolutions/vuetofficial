import Calendar from 'components/calendars/Calendar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { selectAllTasks } from 'reduxStore/slices/tasks/selectors';

function CalendarScreen() {
  const allTasks = useSelector(selectAllTasks);
  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        tasks={Object.values(allTasks.byId)}
        alwaysIncludeCurrentDate={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

export default CalendarScreen;

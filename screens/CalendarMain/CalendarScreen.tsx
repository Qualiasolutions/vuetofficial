import Calendar from 'components/calendars/Calendar';
import GenericError from 'components/molecules/GenericError';
import { Text } from 'components/Themed';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetAllTasksQuery } from 'reduxStore/services/api';

function CalendarScreen() {
  const { data: allTasks, error, isLoading } = useGetAllTasksQuery();

  if (error) {
    return <GenericError />;
  }

  return isLoading || !allTasks ? null : (
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

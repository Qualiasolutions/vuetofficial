import Calendar from 'components/calendars/Calendar';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { selectAllTasks } from 'reduxStore/slices/tasks/selectors';

function CalendarScreen() {
  const allTasks = useSelector(selectAllTasks);
  return (<SafeAreaView>
    <Calendar
      tasks={Object.values(allTasks.byId)}
      alwaysIncludeCurrentDate={true}
    />
  </SafeAreaView>);
}

export default CalendarScreen;

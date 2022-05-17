import Calendar from 'components/calendars/Calendar';
import React from 'react';

import { useSelector } from 'react-redux';
import { selectAllTasks } from 'reduxStore/slices/tasks/selectors';

function CalendarScreen() {
  const allTasks = useSelector(selectAllTasks);
  return <Calendar tasks={Object.values(allTasks.byId)}/>
}

export default CalendarScreen;

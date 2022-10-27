/*
  EntityCalendarPage - this is a calendar component for displaying tasks (and periods) filtered to
    a specific entity
*/

import Calendar from 'components/calendars/TaskCalendar';

function EntityCalendarPage({ entityIds }: { entityIds: number[] }) {
  return (
    <Calendar
      taskFilters={[(task) => entityIds.includes(task.entity)]}
      periodFilters={[(period) => entityIds.includes(period.entity)]}
    />
  );
}

export default EntityCalendarPage;

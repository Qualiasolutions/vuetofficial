/*
  EntityCalendarPage - this is a calendar component for displaying tasks (and periods) filtered to
    a specific entity
*/

import Calendar from 'components/calendars/TaskCalendar';

function EntityCalendarPage({ entityIds }: { entityIds: number[] }) {
  const entityFilter = (scheduledItem: any) =>
    entityIds.includes(scheduledItem.entity);
  return (
    <Calendar
      taskFilters={[entityFilter]}
      periodFilters={[entityFilter]}
      reminderFilters={[entityFilter]}
    />
  );
}

export default EntityCalendarPage;

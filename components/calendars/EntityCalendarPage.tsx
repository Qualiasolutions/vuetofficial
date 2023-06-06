/*
  EntityCalendarPage - this is a calendar component for displaying tasks (and periods) filtered to
    a specific entity
*/

import Calendar from 'components/calendars/TaskCalendar';
import { ParsedPeriod } from 'types/periods';
import { MinimalScheduledTask } from './TaskCalendar/components/Task';

function EntityCalendarPage({ entityIds }: { entityIds: number[] }) {
  // TODO
  // const entityFilter = (scheduledItem: MinimalScheduledTask | ParsedPeriod) =>
  //   scheduledItem.entities.some((entity) => entityIds.includes(entity));
  return <Calendar fullPage={false} />;
}

export default EntityCalendarPage;

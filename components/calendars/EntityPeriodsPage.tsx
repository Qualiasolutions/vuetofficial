import PeriodCalendar from 'components/calendars/PeriodCalendar';

function EntityPeriodsPage({ entityIds }: { entityIds: number[] }) {
  return (
    <PeriodCalendar filters={[(period) => entityIds.includes(period.entity)]} />
  );
}

export default EntityPeriodsPage;

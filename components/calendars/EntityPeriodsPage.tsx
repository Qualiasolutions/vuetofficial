import PeriodCalendar from 'components/calendars/PeriodCalendar';

function EntityPeriodsPage({ entityIds }: { entityIds: number[] }) {
  return (
    <PeriodCalendar
      filters={[
        (period) => entityIds.some((entity) => period.entities.includes(entity))
      ]}
    />
  );
}

export default EntityPeriodsPage;

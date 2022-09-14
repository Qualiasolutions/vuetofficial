import PeriodCalendar from 'components/calendars/PeriodCalendar';
import { PaddedSpinner } from 'components/molecules/Spinners';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';

function EntityPeriodsPage({ entityId }: { entityId: number }) {
  const { data: userDetails } = getUserFullDetails();
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });
  const entityData = allEntities?.byId[entityId];

  if (!entityData) {
    return <PaddedSpinner />;
  }

  return (
    <PeriodCalendar filters={[(period) => period.entity === entityData.id]} />
  );
}

export default EntityPeriodsPage;

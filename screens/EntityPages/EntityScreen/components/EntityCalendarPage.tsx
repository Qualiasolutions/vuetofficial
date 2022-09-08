import Calendar from 'components/calendars/Calendar';
import { PaddedSpinner } from 'components/molecules/Spinners';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';

function EntityCalendarPage({ entityId }: { entityId: number }) {
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

  return <Calendar filters={[(task) => task.entity === entityData.id]} />;
}

export default EntityCalendarPage;

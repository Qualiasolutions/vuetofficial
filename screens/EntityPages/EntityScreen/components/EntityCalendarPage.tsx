/*
  EntityCalendarPage - this is a calendar component for displaying tasks (and periods) filtered to
    a specific entity
*/

import Calendar from 'components/calendars/TaskCalendar';
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

  return (
    <Calendar
      taskFilters={[(task) => task.entity === entityData.id]}
      periodFilters={[(period) => period.entity === entityData.id]}
    />
  );
}

export default EntityCalendarPage;

/*
  ChildEntitiesCalendarScreen - this is a calendar component for displaying tasks (and periods) filtered to
    specific child entities of a parent entity. The route parameter props that are used are:
      - entityId: the ID of the parent entity
      - entityTypes: the resource types of the child entities to show
*/

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React from 'react';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { PaddedSpinner } from 'components/molecules/Spinners';
import Calendar from 'components/calendars/TaskCalendar';
import useEntityHeader from '../../../headers/hooks/useEntityHeader';

export default function ChildEntitiesCalendarScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'ChildEntitiesCalendarScreen'>) {
  const { data: userDetails } = useGetUserDetails();

  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.id || -1);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = allEntities?.byId[entityId];

  useEntityHeader(entityId);

  const isLoading = isLoadingEntities;

  if (isLoading || !entity) {
    return null;
  }

  if (entitiesError) {
    return <GenericError />;
  }

  if (!entity) {
    return <PaddedSpinner />;
  }

  const childEntityIds = entity.child_entities || [];
  let childEntities = childEntityIds.map((id) => allEntities?.byId[id]);

  const entityTypes = route.params.entityTypes;
  if (entityTypes) {
    childEntities = childEntities.filter((entity) =>
      entityTypes.includes(entity.resourcetype)
    );
  }

  if (route.params.includeParentTasks) {
    childEntities.push(entity);
  }

  return (
    <Calendar
      taskFilters={[
        (task) =>
          childEntities
            .map((ent) => ent.id)
            .some((ent) => task.entities.includes(ent))
      ]}
      periodFilters={[
        (period) =>
          childEntities
            .map((ent) => ent.id)
            .some((ent) => period.entities.includes(ent))
      ]}
      fullPage={false}
    />
  );
}

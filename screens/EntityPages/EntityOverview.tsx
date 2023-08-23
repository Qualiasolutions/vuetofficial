import React from 'react';
import { useSelector } from 'react-redux';
import EventPage from './EntityScreens/components/EventPage';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { EntityTypeName } from 'types/entities';

export const RESOURCE_TYPE_TO_COMPONENT = {
  Event: EventPage,
  AnniversaryPlan: EventPage,
  HolidayPlan: EventPage
} as {
  [key in EntityTypeName]?: React.ElementType;
};

export default function EntityOverview({ entityId }: { entityId: number }) {
  const entity = useSelector(selectEntityById(entityId));
  const resourceType = entity?.resourcetype;

  if (!resourceType) {
    return null;
  }

  const Comp = RESOURCE_TYPE_TO_COMPONENT[resourceType];

  if (!Comp) {
    return null;
  }

  return <Comp entityId={entityId} />;
}

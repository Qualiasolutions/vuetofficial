import React from 'react';
import { useSelector } from 'react-redux';
import EventPage from './EntityScreens/components/EventPage';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';

export const RESOURCE_TYPE_TO_COMPONENT = {
  Event: EventPage
} as {
  [key: string]: React.ElementType;
};

export default function EntityOverview({ entityId }: { entityId: number }) {
  const entity = useSelector(selectEntityById(entityId));
  const resourceType = entity?.resourcetype;

  if (!resourceType || !RESOURCE_TYPE_TO_COMPONENT[resourceType]) {
    return null;
  }

  const Comp = RESOURCE_TYPE_TO_COMPONENT[resourceType];

  return <Comp entityId={entityId} />;
}

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import ChildEntityList from './components/ChildEntityList';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import Calendar from 'components/calendars/Calendar';

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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: entity?.name
    });
  }, [entity]);

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

  return (
    <Calendar
      filters={[
        (task) => childEntities.map((ent) => ent.id).includes(task.entity)
      ]}
    />
  );
}

import React from 'react';
import { ScrollView } from 'react-native';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';
import { FullPageSpinner } from 'components/molecules/Spinners';

export default function ChildEntityListScreen({
  entityId,
  entityTypes = null
}: {
  entityId: number;
  entityTypes: string[] | null;
}) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });
  const entityData = allEntities?.byId[entityId];

  if (isLoading || !entityData) {
    return <FullPageSpinner />;
  }

  const childEntityIds = entityData.child_entities || [];
  let childEntities = childEntityIds.map((id) => allEntities?.byId[id]);

  if (entityTypes) {
    childEntities = childEntities.filter((entity) =>
      entityTypes.includes(entity.resourcetype)
    );
  }

  const childEntityList = childEntities.map((entity) => (
    <ListLink
      text={entity.name || ''}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: entity.id }}
      key={entity.id}
      navMethod="push"
    />
  ));

  return <ScrollView>{childEntityList}</ScrollView>;
}

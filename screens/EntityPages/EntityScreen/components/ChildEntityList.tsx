import React from 'react';
import { ScrollView } from 'react-native';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';
import { FullPageSpinner } from 'components/molecules/Spinners';
import AddEntityForm from 'components/forms/AddEntityForm';
import { EntityResponseType, EntityTypeName } from 'types/entities';
import linkMapping from 'components/forms/entityCards';

function DefaultLink({ entity }: { entity: EntityResponseType }) {
  return (
    <ListLink
      text={entity.name || ''}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: entity.id }}
      navMethod="push"
    />
  );
}

export default function ChildEntityList({
  entityId,
  entityTypes = null,
  showCreateForm = false
}: {
  entityId: number;
  entityTypes: EntityTypeName[] | null;
  showCreateForm: boolean;
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

  const childEntityList = childEntities.map((entity) => {
    const resourceType = entity.resourcetype;
    const Link = linkMapping[resourceType] || DefaultLink;
    return <Link key={entity.id} entity={entity} />;
  });

  return (
    <ScrollView>
      {childEntityList}
      {showCreateForm && entityTypes?.length === 1 && (
        <AddEntityForm
          entityType={entityTypes && entityTypes[0]}
          parentId={entityId}
        />
      )}
    </ScrollView>
  );
}

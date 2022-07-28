import React, { useEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';
import AddEntityForm from 'components/forms/AddEntityForm';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import linkMapping from 'components/forms/entityCards';
import { EntityResponseType } from 'types/entities';

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

type EntityListScreenProps = EntityTabScreenProps<'EntityList'>;

export default function EntityListScreen({
  navigation,
  route
}: EntityListScreenProps) {
  const { entityTypes, showCreateForm } = route.params;
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });
  const entityData = Object.values(allEntities?.byId || {}).filter((entity) =>
    entityTypes.includes(entity.resourcetype)
  );
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      title: t(`entityTypes.${route.params.entityTypeName}`)
    });
  }, [route.params.entityTypeName]);

  const listLinks = entityData.map((entity) => {
    const resourceType = entity.resourcetype;
    const Link = linkMapping[resourceType] || DefaultLink;
    return <Link key={entity.id} entity={entity} />;
  });

  return (
    <WhiteFullPageScrollView>
      {listLinks}
      {showCreateForm && entityTypes?.length === 1 && (
        <AddEntityForm entityType={entityTypes && entityTypes[0]} />
      )}
    </WhiteFullPageScrollView>
  );
}

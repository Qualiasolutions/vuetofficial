import React, { useEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';
import { AnniversaryCard } from 'components/entityCards/AnniversaryCard';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';

type EntityListScreenProps = EntityTabScreenProps<'EntityList'>;

const cards = {
  anniversaries: AnniversaryCard
}

export default function EntityListScreen({
  navigation,
  route
}: EntityListScreenProps) {
  const entityName = route.params.entityTypeName
  let CardComponent = ListLink;

  if(entityName == 'anniversaries') CardComponent = cards['anniversaries'];  
  
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
    route.params.entityTypes.includes(entity.resourcetype)
  );
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      title: t(`entityTypes.${route.params.entityTypeName}`)
    });
  }, [route.params.entityTypeName]);

  const listLinks = entityData?.map((entity) => (
    <CardComponent
      text={t(entity.name)}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: entity.id }}
      key={entity.id}
      navMethod="push"
    />
  ));

  return <WhiteFullPageScrollView contentContainerStyle={{paddingBottom: 100}}>{listLinks}</WhiteFullPageScrollView>;
}

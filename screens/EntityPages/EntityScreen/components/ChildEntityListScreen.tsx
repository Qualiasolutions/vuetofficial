import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { RootTabScreenProps } from 'types/base';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';

export default function ChildEntityListScreen({
  entityId
}: {
  entityId: number;
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
  const { t } = useTranslation();

  const childEntityIds = entityData?.child_entities || [];
  const childEntityList = childEntityIds.map((id) => (
    <ListLink
      text={allEntities?.byId[id].name || ''}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: id }}
      key={id}
      navMethod="push"
    />
  ));

  return <ScrollView>{childEntityList}</ScrollView>;
}

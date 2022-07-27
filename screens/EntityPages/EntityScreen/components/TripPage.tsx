import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';
import {
  TransparentContainerView,
  WhiteBox,
} from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';

export default function TripPage({ entityId }: { entityId: number }) {
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

  const entityIdParsed =
    typeof entityId === 'number' ? entityId : parseInt(entityId);

  const transportationLink = (
    <WhiteBox style={styles.linkWrapper}>
      <ListLink
        text="Transportation"
        toScreen="ChildEntitiesScreen"
        toScreenParams={{
          entityTypes: ['TripTransport'],
          entityId: entityIdParsed,
          showCreateForm: true,
        }}
        style={styles.listLink}
        navMethod="push"
      />
    </WhiteBox>
  );


  const accommodationLink = (
    <WhiteBox style={styles.linkWrapper}>
      <ListLink
        text="Accommodation"
        toScreen="ChildEntitiesScreen"
        toScreenParams={{
          entityTypes: ['TripAccommodation'],
          entityId: entityIdParsed,
          showCreateForm: true,
        }}
        style={styles.listLink}
        navMethod="push"
      />
    </WhiteBox>
  );

  const activitiesLink = (
    <WhiteBox style={styles.linkWrapper}>
      <ListLink
        text="Activities"
        toScreen="ChildEntitiesScreen"
        toScreenParams={{
          entityTypes: ['TripActivity'],
          entityId: entityIdParsed,
          showCreateForm: true,
        }}
        style={styles.listLink}
        navMethod="push"
      />
    </WhiteBox>
  );

  const childEntityIds = entityData?.child_entities || [];
  const childEntityList = childEntityIds.map((id) => (
    allEntities?.byId[id].resourcetype === 'List'
    ? (
    <WhiteBox key={id} style={styles.linkWrapper}>
      <ListLink
        text={allEntities?.byId[id].name || ''}
        toScreen="EntityScreen"
        toScreenParams={{ entityId: id }}
        style={styles.listLink}
        navMethod="push"
      />
    </WhiteBox>
    ) : null
  ));


  return (
    <WhiteFullPageScrollView>
      <TransparentContainerView>
        {transportationLink}
        {accommodationLink}
        {activitiesLink}
        {childEntityList}
      </TransparentContainerView>
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  linkWrapper: {
    width: '100%',
    margin: 8,
    paddingVertical: 0
  },
  listLink: {
    shadowColor: 'transparent'
  }
});

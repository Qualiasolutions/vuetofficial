import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import useGetUserDetails from 'hooks/useGetUserDetails';
import ListLink from 'components/molecules/ListLink';
import {
  TransparentContainerView,
  WhiteBox,
} from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';

export default function HobbyScreen({ entityId }: { entityId: number }) {
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userError
  } = useGetUserDetails()

  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const { t } = useTranslation();
  
  const isLoading = isLoadingUserDetails || isLoadingEntities
  if (isLoading) {
    return <FullPageSpinner/>
  }
  
  const entityIdParsed = typeof entityId === 'number' ? entityId : parseInt(entityId);

  const listLink = (
    <WhiteBox style={styles.linkWrapper}>
      <ListLink
        text="Lists"
        toScreen="ChildEntitiesScreen"
        toScreenParams={{
          entityTypes: ['List'],
          entityId: entityIdParsed
        }}
        style={styles.listLink}
        navMethod="push"
      />
    </WhiteBox>
  );

  const eventLink = (
    <WhiteBox style={styles.linkWrapper}>
      <ListLink
        text="Event"
        toScreen="EntityList"
        toScreenParams={{
          entityTypes: ['Event'],
          entityTypeName: 'events'
        }}
        style={styles.listLink}
        navMethod="push"
      />
    </WhiteBox>
  );

  return (
    <WhiteFullPageScrollView>
      <TransparentContainerView>
        {listLink}
        {eventLink}
      </TransparentContainerView>
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  linkWrapper: {
    width: '100%',
    margin: 8,
    paddingVertical: 0
  },
  listLink: {
    shadowColor: 'transparent'
  }
});

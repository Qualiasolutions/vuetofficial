import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import useGetUserDetails from 'hooks/useGetUserDetails';
import ListLink from 'components/molecules/ListLink';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';

export default function HobbyScreen({ entityId }: { entityId: number }) {
  const {
    data: userDetails,
    isLoading: isLoadingUserDetails,
    error: userError
  } = useGetUserDetails();

  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const { t } = useTranslation();

  const isLoading = isLoadingUserDetails || isLoadingEntities;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  const entityIdParsed =
    typeof entityId === 'number' ? entityId : parseInt(entityId);

  const listLink = (
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
  );

  const eventLink = (
    <ListLink
      text="Plan an Event"
      toScreen="EntityList"
      toScreenParams={{
        entityTypes: ['Event'],
        entityTypeName: 'events'
      }}
      style={styles.listLink}
      navMethod="push"
    />
  );

  const scheduleLink = (
    <ListLink
      text="Create a schedule"
      toScreen=""
      toScreenParams={{}}
      style={styles.listLink}
      navMethod="push"
    />
  );

  const travelLink = (
    <ListLink
      text={"Travel - Link to travel"}
      toScreen=""
      toScreenParams={{}}
      style={styles.listLink}
      navMethod="push"
    />
  );

  const customLink = (
    <ListLink
      text={"Custom - Define later"}
      toScreen=""
      toScreenParams={{
        entityTypes: ['Event'],
        entityTypeName: 'events'
      }}
      style={styles.listLink}
      navMethod="push"
    />
  );

  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView>
        {scheduleLink}
        {listLink}
        {eventLink}
        {travelLink}
        {customLink}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  listLink: {
    borderRadius: 16,
    marginBottom: 15
  }
});

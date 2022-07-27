import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import useGetUserDetails from 'hooks/useGetUserDetails';
import ListLink from 'components/molecules/ListLink';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { useThemeColor } from 'components/Themed';

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
      text="Create a list"
      toScreen="ChildEntitiesScreen"
      toScreenParams={{
        entityTypes: ['List'],
        entityId: entityIdParsed
      }}
      style={styles.listLink}
      navMethod="push"
      showDot
      dotStyle={styles.dotStyle()}
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
      showDot
      dotStyle={styles.dotStyle()}
    />
  );

  const scheduleLink = (
    <ListLink
      text="Create a schedule"
      toScreen=""
      toScreenParams={{}}
      style={styles.listLink}
      navMethod="push"
      showDot
      dotStyle={styles.dotStyle()}
    />
  );

  const travelLink = (
    <ListLink
      text="Travel - Link to travel"
      toScreen=""
      toScreenParams={{}}
      style={styles.listLink}
      navMethod="push"
      showDot
      dotStyle={styles.dotStyle()}
    />
  );

  const customLink = (
    <ListLink
      text="Travel - Link to travel"
      toScreen=""
      toScreenParams={{
        entityTypes: ['Event'],
        entityTypeName: 'events'
      }}
      style={styles.listLink}
      navMethod="push"
      showDot
      dotStyle={styles.dotStyle()}
    />
  );

  return (
    <WhiteFullPageScrollView contentContainerStyle={styles.container}>
      {scheduleLink}
      {listLink}
      {eventLink}
      {travelLink}
      {customLink}
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  container: { paddingHorizontal: 23 },
  listLink: {
    borderRadius: 16,
    marginTop: 15
  },
  dotStyle: () => ({
    marginRight: 10,
    backgroundColor: useThemeColor({}, 'blue')
  })
});

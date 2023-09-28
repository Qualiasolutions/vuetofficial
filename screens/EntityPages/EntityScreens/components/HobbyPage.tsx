import React from 'react';
import ListLink from 'components/molecules/ListLink';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';

const styles = StyleSheet.create({
  listLink: {
    borderRadius: 16,
    marginBottom: 15
  }
});

export default function HobbyScreen({ entityId }: { entityId: number }) {
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
      toScreen="NotFound" //TODO
      toScreenParams={{}}
      style={styles.listLink}
      navMethod="push"
    />
  );

  const travelLink = (
    <ListLink
      text={'Travel - Link to travel'}
      toScreen="NotFound" //TODO
      toScreenParams={{}}
      style={styles.listLink}
      navMethod="push"
    />
  );

  const customLink = (
    <ListLink
      text={'Custom - Define later'}
      toScreen="NotFound" //TODO
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

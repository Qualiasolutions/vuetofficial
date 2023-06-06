import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import ListLink from 'components/molecules/ListLink';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';

export default function TripPage({ entityId }: { entityId: number }) {
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(null as any);
  const entityData = allEntities?.byId[entityId];
  const { t } = useTranslation();

  const entityIdParsed =
    typeof entityId === 'number' ? entityId : parseInt(entityId);

  const transportationLink = (
    <ListLink
      text={t('linkTitles.travel.transportation')}
      toScreen="ChildEntitiesCalendarScreen"
      toScreenParams={{
        entityTypes: [
          'Flight',
          'TrainBusFerry',
          'RentalCar',
          'TaxiOrTransfer',
          'DriveTime'
        ],
        entityId: entityIdParsed
      }}
      navMethod="push"
    />
  );

  const accommodationLink = (
    <ListLink
      text={t('linkTitles.travel.accommodation')}
      toScreen="ChildEntitiesCalendarScreen"
      toScreenParams={{
        entityTypes: ['HotelOrRental', 'StayWithFriend'],
        entityId: entityIdParsed
      }}
      navMethod="push"
    />
  );

  const childEntities = entityData?.child_entities;
  const childEntityTypes =
    childEntities && allEntities
      ? [
          ...new Set(
            childEntities.map(
              (childId) => allEntities.byId[childId].resourcetype
            )
          )
        ]
      : [];

  const calendarLink = (
    <ListLink
      text={t('linkTitles.generic.calendar')}
      toScreen="ChildEntitiesCalendarScreen"
      toScreenParams={{
        entityTypes: childEntityTypes,
        entityId: entityIdParsed,
        includeParentTasks: true
      }}
      navMethod="push"
    />
  );

  const activitiesLink = (
    <ListLink
      text={t('linkTitles.travel.activities')}
      toScreen="ChildEntitiesCalendarScreen"
      toScreenParams={{
        entityTypes: ['TripActivity'],
        entityId: entityIdParsed
      }}
      navMethod="push"
    />
  );

  const childEntityIds = entityData?.child_entities || [];
  const childEntityList = childEntityIds.map((id) =>
    allEntities?.byId[id].resourcetype === 'List' ? (
      <ListLink
        key={id}
        text={allEntities?.byId[id].name || ''}
        toScreen="EntityScreen"
        toScreenParams={{ entityId: id }}
        navMethod="push"
      />
    ) : null
  );

  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView>
        {transportationLink}
        {accommodationLink}
        {activitiesLink}
        {calendarLink}
        {childEntityList}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

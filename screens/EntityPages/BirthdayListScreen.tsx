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
import linkMapping from 'components/entityCards';
import { EntityResponseType } from 'types/entities';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { monthNames } from 'utils/datesAndTimes';
import { StyleSheet } from 'react-native';
const _ = require('lodash');

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

export default function BirthdayListScreen({
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

  const birthdayGroups = entityData.reduce((entity, entityItem) => {
    const date = entityItem?.start_date?.split('-')[1];
    if (!entity[date]) {
      entity[date] = [];
    }
    entity[date].push(entityItem);
    return entity;
  }, {});

  const groupArrays =
    Object.keys(birthdayGroups).map((date) => {
      return {
        date: monthNames[Number(date) - 1],
        birthdays: birthdayGroups[date]
      };
    }) || [];

  const listLinks =
    groupArrays &&
    groupArrays?.map((entity, index) => {
      return (
        <TransparentView>
          <AlmostBlackText style={styles.dateHeading} text={entity.date} />
          {entity.birthdays.map((birthday) => {
            const resourceType = birthday.resourcetype;
            const Link = linkMapping[resourceType] || DefaultLink;
            return <Link key={birthday.id} entity={birthday} />;
          })}
        </TransparentView>
      );
    });

  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView>
        {listLinks}
        {showCreateForm && entityTypes?.length === 1 && (
          <AddEntityForm entityType={entityTypes && entityTypes[0]} />
        )}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  dateHeading: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 27,
    fontWeight: '700'
  }
})

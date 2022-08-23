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
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import {
  AlmostBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import { SafeAreaView, StyleSheet } from 'react-native';
import { sectionNameMapping } from './utils/sectionNameMapping';
import { entityOrderings } from './utils/entityOrderings';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { useThemeColor } from 'components/Themed';
import { backgroundComponents } from 'screens/Forms/EntityForms/utils/backgroundComponents';

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

  const addEntityHeaderTintColor = useThemeColor({}, 'primary');

  useEffect(() => {
    if (entityData && entityData.length === 0) {
      navigation.setOptions({
        title: t('screens.addEntity.title', {
          entityType: t(`entityTypes.${route.params.entityTypeName}`)
        }),
        headerTintColor: addEntityHeaderTintColor
      });
    } else {
      navigation.setOptions({
        title: t(`entityTypes.${route.params.entityTypeName}`)
      });
    }
  }, [route.params.entityTypeName, entityData]);

  if (isLoading || !entityData) {
    return <FullPageSpinner />;
  }

  const ordering = entityOrderings[entityData[0]?.resourcetype] || null;
  const orderedEntityData = ordering
    ? entityData.sort(ordering)
    : [...entityData];

  const sections = {} as { [key: string]: EntityResponseType[] };

  const toSectionName = sectionNameMapping[entityData[0]?.resourcetype] || null;
  if (toSectionName) {
    for (const entity of orderedEntityData) {
      if (sections[toSectionName(entity)]) {
        sections[toSectionName(entity)].push(entity);
      } else {
        sections[toSectionName(entity)] = [entity];
      }
    }
  }

  let listLinks;
  if (toSectionName) {
    listLinks = Object.entries(sections).map((entry, i) => {
      const sectionTitle = entry[0];
      const entities = entry[1];
      return (
        <TransparentView key={i}>
          <AlmostBlackText style={styles.sectionTitle} text={sectionTitle} />
          {entities.map((entity) => {
            const resourceType = entity.resourcetype;
            const Link = linkMapping[resourceType] || DefaultLink;
            return <Link key={entity.id} entity={entity} />;
          })}
        </TransparentView>
      );
    });
  } else {
    listLinks = entityData.map((entity) => {
      const resourceType = entity.resourcetype;
      const Link = linkMapping[resourceType] || DefaultLink;
      return <Link key={entity.id} entity={entity} />;
    });
  }

  const BackgroundComponent = (
    listLinks.length === 0 && entityTypes
      ? backgroundComponents[entityTypes[0]] || backgroundComponents.default
      : WhiteFullPageScrollView
  ) as React.ElementType;

  return (
    <BackgroundComponent>
      <TransparentPaddedView style={styles.container}>
        {listLinks}
        {((showCreateForm && entityTypes?.length === 1) ||
          listLinks.length === 0) && (
          <AddEntityForm entityType={entityTypes && entityTypes[0]} />
        )}
      </TransparentPaddedView>
    </BackgroundComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 100
  },
  sectionTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 27,
    fontWeight: '700'
  }
});

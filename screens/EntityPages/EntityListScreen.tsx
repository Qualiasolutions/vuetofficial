import React, { useLayoutEffect, useMemo, useState } from 'react';
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
import { Pressable, StyleSheet } from 'react-native';
import { sectionNameMapping } from './utils/sectionNameMapping';
import { entityOrderings } from './utils/entityOrderings';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import { backgroundComponents } from 'screens/Forms/EntityForms/utils/backgroundComponents';
import { headerRightMapping } from './utils/headerRightMapping';
import { headerBackgroundMapping } from './utils/headerBackgroundMapping';
import { headerTintColorMapping } from './utils/headerTintColorMapping';
import { datetimeSettingsMapping } from './utils/datetimeSettingsMapping';
import { headerMapping } from './utils/headerMappings';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack';

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
    isFetching,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });
  const entityData = Object.values(allEntities?.byId || {}).filter((entity) =>
    entityTypes.includes(entity.resourcetype)
  );
  const { t } = useTranslation();
  const [monthsBack, setMonthsBack] = useState(0);

  useLayoutEffect(() => {
    const HeaderRightComponent =
      headerRightMapping[route.params.entityTypeName];
    const headerRight = () =>
      HeaderRightComponent ? (
        <HeaderRightComponent navigation={navigation} route={route} />
      ) : null;

    const HeaderBackgroundComponent =
      headerBackgroundMapping[route.params.entityTypeName];
    const headerBackground = () =>
      HeaderBackgroundComponent ? <HeaderBackgroundComponent /> : null;

    const headerTintColor =
      headerTintColorMapping[route.params.entityTypeName] || null;

    const HeaderComponent = headerMapping[route.params.entityTypeName] || null;
    const header = HeaderComponent
      ? (props: NativeStackHeaderProps) => <HeaderComponent {...props} />
      : null;

    const options: Partial<NativeStackNavigationOptions> = {
      title: t(`entityTypes.${route.params.entityTypeName}`),
      headerRight,
      headerBackground,
      headerTintColor
    };

    if (header) {
      options.header = header;
    }

    navigation.setOptions(options);
  }, [route.params.entityTypeName]);

  if (isLoading || !entityData) {
    return <FullPageSpinner />;
  }

  const entityDatetimeSettings =
    datetimeSettingsMapping[entityData[0]?.resourcetype] || null;
  const ordering = entityOrderings[entityData[0]?.resourcetype] || null;
  const orderedEntityData = ordering
    ? entityData.sort(ordering)
    : [...entityData];

  const datetimeFilteredEntityData = useMemo(() => {
    const earliestDate = new Date();
    earliestDate.setMonth(earliestDate.getMonth() - monthsBack);

    if (!entityDatetimeSettings) {
      return orderedEntityData;
    }
    if (!entityDatetimeSettings.hidePrevious) {
      return orderedEntityData;
    }

    return orderedEntityData.filter((entity) => {
      if (new Date(entity[entityDatetimeSettings.endField]) < earliestDate) {
        return false;
      }
      return true;
    });
  }, [orderedEntityData, monthsBack]);

  const sections = {} as { [key: string]: EntityResponseType[] };

  const toSectionName = sectionNameMapping[entityData[0]?.resourcetype] || null;
  if (toSectionName) {
    for (const entity of datetimeFilteredEntityData) {
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

  const showPreviousButton = entityDatetimeSettings?.allowShowPrevious
    ? monthsBack < 24 &&
      datetimeFilteredEntityData.length < orderedEntityData.length && (
        <Pressable
          onPress={() => setMonthsBack(monthsBack + 6)}
          style={styles.showOlderWrapper}
        >
          <AlmostBlackText
            text={t('components.calendar.showOlderEvents')}
            style={styles.showOlderText}
          />
        </Pressable>
      )
    : null;

  if (listLinks.length === 0) {
    return (
      <BackgroundComponent>
        {showPreviousButton}
        <TransparentPaddedView style={styles.container}>
          <AlmostBlackText
            text={t('misc.currentlyNoEntities', {
              entityType: t(`entityTypes.${route.params.entityTypeName}`)
            })}
            style={styles.noEntitiesText}
          />
        </TransparentPaddedView>
      </BackgroundComponent>
    );
  }

  return (
    <BackgroundComponent>
      {showPreviousButton}
      <TransparentPaddedView style={styles.container}>
        {listLinks}
        {isFetching && <PaddedSpinner />}
        {showCreateForm && entityTypes?.length === 1 && (
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
  noEntitiesText: {
    fontSize: 20,
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 27,
    fontWeight: '700'
  },
  showOlderWrapper: {
    padding: 20,
    paddingBottom: 0
  },
  showOlderText: {
    fontSize: 16
  }
});

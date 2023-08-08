import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import EntityListPage from 'components/lists/EntityListPage';
import { Button } from 'components/molecules/ButtonComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  selectEntitiesByEntityTypes,
  selectEntityById
} from 'reduxStore/slices/entities/selectors';
import { EntityResponseType } from 'types/entities';
import PlanningLists from './PlanningLists';
import ShoppingLists from './ShoppingLists';

export type NavigatorParamList = {
  Home: undefined;
  PlanningLists: undefined;
  ShoppingLists: undefined;
};
const TopTabs = createMaterialTopTabNavigator<NavigatorParamList>();

type Props = {
  entities?: number[];
  entityTypes?: string[];
  tags?: string[];
  tagsFirst?: boolean;
  categories?: number[];
  showCategoryHeaders?: boolean;
};

const styles = StyleSheet.create({
  container: { paddingBottom: 100, width: '100%' },
  entityTitle: { fontSize: 22 },
  topButtons: { flexDirection: 'row', borderBottomWidth: 2 },
  topButton: { padding: 10 },
  topButtonLeft: { borderRightWidth: 1 },
  topButtonRight: { borderLeftWidth: 1 }
});

const FlatList = ({ entityId }: { entityId: number }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const parentEntity = useSelector(selectEntityById(entityId));
  const { data: allEntities } = useGetAllEntitiesQuery(null as any);

  if (!parentEntity || !allEntities) {
    return null;
  }

  const childEntities = parentEntity?.child_entities;
  const listEntities = childEntities.filter(
    (id) => allEntities.byId[id].resourcetype === 'List'
  );

  const existingLists =
    listEntities.length > 0 ? (
      <EntityListPage
        entityTypes={['List']}
        entityTypeName={'List'}
        entityFilters={[(ent: EntityResponseType) => ent.parent === entityId]}
      />
    ) : null;

  return (
    <TransparentPaddedView>
      <Text style={styles.entityTitle}>{parentEntity.name}</Text>
      {existingLists}
      <Button
        title={t('components.listOfLists.addList')}
        onPress={() => {
          (navigation.navigate as any)('AddEntity', {
            entityTypes: 'List',
            parentId: entityId
          });
        }}
      />
    </TransparentPaddedView>
  );
};

const ListOfLists = ({
  entities,
  entityTypes,
  categories,
  showCategoryHeaders
}: Props) => {
  const { t } = useTranslation();
  const { data: allEntities } = useGetAllEntitiesQuery(null as any);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const listEntities = useSelector(selectEntitiesByEntityTypes(['List']));

  if (!allEntities || !allCategories) {
    return <PaddedSpinner />;
  }

  const entitiesToShow: number[] = (
    entities ||
    Array.from(
      new Set(
        listEntities
          .map((list) => allEntities.byId[list]?.parent)
          .filter((listEntity) => !!listEntity)
      )
    )
  ).filter((entityId) => {
    if (
      categories &&
      categories.includes(allEntities.byId[entityId]?.category)
    ) {
      return true;
    }
    if (entities && entities.includes(entityId)) {
      return true;
    }
    if (
      entityTypes &&
      allEntities.byId[entityId] &&
      entityTypes.includes(allEntities.byId[entityId]?.resourcetype)
    ) {
      return true;
    }
    if (!(categories || entities || entityTypes)) {
      // If no args are provided then we show everything
      return true;
    }
    return false;
  });

  return (
    <WhiteFullPageScrollView
      contentContainerStyle={styles.container}
      style={styles.container}
    >
      {entitiesToShow.length > 0 ? (
        entitiesToShow.map((entityId) => (
          <FlatList entityId={entityId} key={entityId} />
        ))
      ) : (
        <TransparentPaddedView>
          <Text>{t('components.listOfLists.noLists')}</Text>
        </TransparentPaddedView>
      )}
    </WhiteFullPageScrollView>
  );
};

export default function ListsNavigator({
  entities,
  entityTypes,
  categories,
  showCategoryHeaders
}: Props) {
  const { t } = useTranslation();

  const listOfListsComponent = useCallback(() => {
    return (
      <ListOfLists
        entities={entities}
        entityTypes={entityTypes}
        categories={categories}
        showCategoryHeaders={showCategoryHeaders}
      />
    );
  }, [entities, entityTypes, categories, showCategoryHeaders]);
  return (
    <TopTabs.Navigator
      initialRouteName="Home"
      screenOptions={{ tabBarLabelStyle: { fontSize: 11 } }}
    >
      <TopTabs.Screen
        name="Home"
        component={listOfListsComponent}
        options={{
          title: t('pageTitles.listsHome')
        }}
      />
      <TopTabs.Screen
        name="PlanningLists"
        component={PlanningLists}
        options={{
          title: t('pageTitles.myPlanningLists')
        }}
      />
      <TopTabs.Screen
        name="ShoppingLists"
        component={ShoppingLists}
        options={{
          title: t('pageTitles.myShoppingLists')
        }}
      />
    </TopTabs.Navigator>
  );
}

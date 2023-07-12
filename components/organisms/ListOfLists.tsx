import { useNavigation } from '@react-navigation/native';
import EntityListPage from 'components/lists/EntityListPage';
import { Button } from 'components/molecules/ButtonComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
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

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  entityTitle: { fontSize: 22 }
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

export default function ListOfLists({
  entities,
  entityTypes,
  categories,
  showCategoryHeaders
}: {
  entities?: number[];
  entityTypes?: string[];
  tags?: string[];
  tagsFirst?: boolean;
  categories?: number[];
  showCategoryHeaders?: boolean;
}) {
  const { t } = useTranslation();
  const { data: allEntities } = useGetAllEntitiesQuery(null as any);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const listEntities = useSelector(selectEntitiesByEntityTypes(['List']));

  if (!allEntities || !allCategories) {
    return <PaddedSpinner />;
  }

  const entitiesToShow: number[] = (
    entities ||
    Array(...new Set(listEntities.map((list) => allEntities.byId[list].parent)))
  ).filter((entityId) => {
    if (
      categories &&
      categories.includes(allEntities.byId[entityId].category)
    ) {
      return true;
    }
    if (entities && entities.includes(entityId)) {
      return true;
    }
    if (
      entityTypes &&
      entityTypes.includes(allEntities.byId[entityId].resourcetype)
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
    <WhiteFullPageScrollView contentContainerStyle={styles.container}>
      {entitiesToShow.map((entityId) => (
        <FlatList entityId={entityId} key={entityId} />
      ))}
    </WhiteFullPageScrollView>
  );
}

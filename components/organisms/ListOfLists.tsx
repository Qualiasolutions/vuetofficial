import { useNavigation } from '@react-navigation/native';
import EntityListPage from 'components/lists/EntityListPage';
import { Button } from 'components/molecules/ButtonComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import useEntities from 'hooks/useEntities';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  selectEntitiesByEntityTypes,
  selectEntityById
} from 'reduxStore/slices/entities/selectors';
import { EntityResponseType, EntityTypeName } from 'types/entities';

type Props = {
  entities?: number[];
  entityTypes?: EntityTypeName[];
  tags?: string[];
  tagsFirst?: boolean;
  categories?: number[];
  showCategoryHeaders?: boolean;
};

const styles = StyleSheet.create({
  container: { paddingBottom: 100, width: '100%' },
  entityTitle: { fontSize: 22 },
  buttonWrapper: { flexDirection: 'row', justifyContent: 'flex-start' }
});

const FlatList = ({ entityId }: { entityId: number }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const parentEntity = useSelector(selectEntityById(entityId));
  const { data: allEntities } = useGetAllEntitiesQuery();

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
      <TransparentView style={styles.buttonWrapper}>
        <Button
          title={t('components.listOfLists.addList')}
          onPress={() => {
            (navigation.navigate as any)('AddEntity', {
              entityTypes: 'List',
              parentId: entityId
            });
          }}
        />
      </TransparentView>
    </TransparentPaddedView>
  );
};

export default function ListOfLists({
  entities,
  entityTypes,
  categories,
  showCategoryHeaders
}: Props) {
  const { t } = useTranslation();
  const { data: allEntities } = useGetAllEntitiesQuery();
  const { data: allCategories } = useGetAllCategoriesQuery();
  const listEntities = useSelector(selectEntitiesByEntityTypes(['List']));

  const relevantEntities = useEntities({
    entities,
    entityTypes,
    categories
  });

  if (!allEntities || !allCategories) {
    return <PaddedSpinner />;
  }

  const entitiesToShow: number[] =
    categories || entities || entityTypes
      ? relevantEntities
      : Array.from(
          new Set(
            listEntities
              .map((list) => allEntities.byId[list]?.parent)
              .filter((listEntity) => !!listEntity)
          )
        );

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
}

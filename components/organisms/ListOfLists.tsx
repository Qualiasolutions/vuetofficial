import { useNavigation } from '@react-navigation/native';
import EntityListPage from 'components/lists/EntityListPage';
import { Button } from 'components/molecules/ButtonComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { EntityResponseType } from 'types/entities';

const styles = StyleSheet.create({
  container: { paddingBottom: 100 }
});

export default function ListOfLists({ entityId }: { entityId: number }) {
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
    <WhiteFullPageScrollView contentContainerStyle={styles.container}>
      <TransparentPaddedView>
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
    </WhiteFullPageScrollView>
  );
}

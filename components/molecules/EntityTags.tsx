import { StyleSheet } from 'react-native';
import { EntityResponseType } from 'types/entities';
import EntityTag from './EntityTag';
import { TransparentScrollView } from './ScrollViewComponents';

export default function EntityTags({
  entities
}: {
  entities: EntityResponseType[];
}) {
  return (
    <TransparentScrollView style={styles.container} horizontal>
      {entities.map((entity) => (
        <EntityTag entity={entity} key={entity.id} />
      ))}
    </TransparentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    width: '100%'
  }
});

import { StyleSheet } from 'react-native';
import EntityTag from './EntityTag';
import { TransparentScrollView } from './ScrollViewComponents';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    width: '100%'
  }
});

export default function EntityTags({ entities }: { entities: number[] }) {
  return (
    <TransparentScrollView style={styles.container} horizontal>
      {entities.map((entity) => (
        <EntityTag entity={entity} key={entity} />
      ))}
    </TransparentScrollView>
  );
}

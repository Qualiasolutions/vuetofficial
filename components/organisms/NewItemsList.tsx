import { useNavigation } from '@react-navigation/native';
import ElevatedPressableBox from 'components/molecules/ElevatedPressableBox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { t } from 'i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import {
  selectEntityById,
  selectNewEntityIds
} from 'reduxStore/slices/entities/selectors';
import {
  selectNewTaskIds,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';

const cardStyles = StyleSheet.create({
  card: { marginBottom: 5 }
});
const NewEntityCard = ({ entityId }: { entityId: number }) => {
  const entity = useSelector(selectEntityById(entityId));
  const navigation = useNavigation();

  if (!entity) {
    return null;
  }
  return (
    <ElevatedPressableBox
      style={cardStyles.card}
      onPress={() => {
        (navigation.navigate as any)('ContentNavigator', {
          screen: 'EntityScreen',
          initial: false,
          params: { entityId }
        });
      }}
    >
      <Text bold={true}>{t('components.newItemsList.newEntity')}</Text>
      <Text bold={true}>{entity.name}</Text>
      <Text>Created on {String(new Date(entity.created_at))}</Text>
    </ElevatedPressableBox>
  );
};

const NewTaskCard = ({ taskId }: { taskId: number }) => {
  const task = useSelector(selectTaskById(taskId));
  const navigation = useNavigation();

  if (!task) {
    return null;
  }
  return (
    <ElevatedPressableBox
      style={cardStyles.card}
      onPress={() => {
        (navigation.navigate as any)('EditTask', {
          taskId: task.id
        });
      }}
    >
      <Text bold={true}>{t('components.newItemsList.newTask')}</Text>
      <Text bold={true}>{task.title}</Text>
      <Text>Created on {String(new Date(task.created_at))}</Text>
    </ElevatedPressableBox>
  );
};

const listStyles = StyleSheet.create({
  container: { paddingBottom: 300 },
  taskCardsWrapper: { marginTop: 50 },
  entityCardsWrapper: { marginTop: 20 }
});

export default function NewItemsList() {
  const newEntityIds = useSelector(selectNewEntityIds);
  const newTaskIds = useSelector(selectNewTaskIds);

  const { data: allEntities, isLoading: isLoadingEntities } =
    useGetAllEntitiesQuery(null as any);
  const { data: allTasks, isLoading: isLoadingTasks } = useGetAllTasksQuery(
    null as any
  );

  const isLoading = isLoadingEntities || isLoadingTasks;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  const orderedItems = [
    ...newEntityIds.map((id) => ({ id, type: 'ENTITY' })),
    ...newTaskIds.map((id) => ({ id, type: 'TASK' }))
  ].sort(({ id: idA, type: typeA }, { id: idB, type: typeB }) => {
    const itemA =
      typeA === 'ENTITY' ? allEntities?.byId[idA] : allTasks?.byId[idA];
    const itemB =
      typeB === 'ENTITY' ? allEntities?.byId[idB] : allTasks?.byId[idB];

    if (!itemA) {
      return -1;
    }

    if (!itemB) {
      return 1;
    }

    return itemA.created_at < itemB.created_at ? 1 : -1;
  });
  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView style={listStyles.container}>
        {orderedItems.map(({ id, type }) => {
          if (type === 'ENTITY') {
            return <NewEntityCard entityId={id} key={`${type}_${id}`} />;
          }
          return <NewTaskCard taskId={id} key={`${type}_${id}`} />;
        })}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

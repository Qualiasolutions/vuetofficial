import { useNavigation } from '@react-navigation/native';
import ElevatedPressableBox from 'components/molecules/ElevatedPressableBox';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
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
      <Text>{entity.name}</Text>
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
      <Text>{task.title}</Text>
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

  const entityCards = newEntityIds.map((entityId) => (
    <NewEntityCard entityId={entityId} key={entityId} />
  ));

  const taskCards = newTaskIds.map((taskId) => (
    <NewTaskCard taskId={taskId} key={taskId} />
  ));

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView style={listStyles.container}>
        <Text>NEW ITEMS</Text>
        <TransparentView style={listStyles.entityCardsWrapper}>
          <Text>NEW ENTITIES</Text>
          {entityCards}
        </TransparentView>
        <TransparentView style={listStyles.taskCardsWrapper}>
          <Text>NEW TASKS</Text>
          {taskCards}
        </TransparentView>
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}

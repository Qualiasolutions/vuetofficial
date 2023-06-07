import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteBox
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

const NewEntityCard = ({ entityId }: { entityId: number }) => {
  const entity = useSelector(selectEntityById(entityId));

  if (!entity) {
    return null;
  }
  return (
    <WhiteBox>
      <Text>{entity.name}</Text>
      <Text>Created on {new String(new Date(entity.created_at))}</Text>
    </WhiteBox>
  );
};

const NewTaskCard = ({ taskId }: { taskId: number }) => {
  const task = useSelector(selectTaskById(taskId));

  if (!task) {
    return null;
  }
  return (
    <WhiteBox>
      <Text>{task.title}</Text>
      <Text>Created on {new String(new Date(task.created_at))}</Text>
    </WhiteBox>
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

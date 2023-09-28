import { useNavigation } from '@react-navigation/native';
import ElevatedPressableBox from 'components/molecules/ElevatedPressableBox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { t } from 'i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  TaskCompletionForm,
  useGetTaskCompletionFormsQuery
} from 'reduxStore/services/api/taskCompletionForms';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import {
  selectEntityById,
  selectNewEntityIds,
  selectNewTaskCompletionFormIds
} from 'reduxStore/slices/entities/selectors';
import {
  selectNewTaskIds,
  selectTaskById,
  selectTaskCompletionFormById
} from 'reduxStore/slices/tasks/selectors';
import { EntityResponseType } from 'types/entities';
import { FixedTaskResponseType } from 'types/tasks';

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
      <Text>
        {t('components.newItemsList.createdOn')}{' '}
        {String(new Date(entity.created_at))}
      </Text>
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

const NewTaskCompletionCard = ({
  taskCompletionId
}: {
  taskCompletionId: number;
}) => {
  const form = useSelector(selectTaskCompletionFormById(taskCompletionId));
  const navigation = useNavigation();
  const task = useSelector(selectTaskById(form ? form.task : -1));
  const { data: user } = useGetUserFullDetails();

  if (!task || !form || !user?.is_premium) {
    return null;
  }

  return (
    <ElevatedPressableBox style={cardStyles.card} onPress={() => {}}>
      <Text bold={true}>{t('components.newItemsList.newTaskCompletion')}</Text>
      <Text bold={true}>{task.title}</Text>
      <Text>
        {form.complete
          ? t('components.newItemsList.completedOn')
          : t('components.newItemsList.uncheckedOn')}{' '}
        {String(new Date(form?.completion_datetime))}
      </Text>
    </ElevatedPressableBox>
  );
};

const listStyles = StyleSheet.create({
  container: { paddingBottom: 300 },
  taskCardsWrapper: { marginTop: 50 },
  entityCardsWrapper: { marginTop: 20 }
});

const isTaskCompletionForm = (
  item: TaskCompletionForm | FixedTaskResponseType | EntityResponseType
): item is TaskCompletionForm => {
  return Object.keys(item).includes('completion_datetime');
};

export default function NewItemsList() {
  const newEntityIds = useSelector(selectNewEntityIds);
  const newTaskIds = useSelector(selectNewTaskIds);
  const newTaskCompletionFormIds = useSelector(selectNewTaskCompletionFormIds);

  const { data: allEntities, isLoading: isLoadingEntities } =
    useGetAllEntitiesQuery();
  const { data: allTasks, isLoading: isLoadingTasks } = useGetAllTasksQuery();
  const {
    data: allTaskCompletionForms,
    isLoading: isLoadingTaskCompletionForms
  } = useGetTaskCompletionFormsQuery();

  const isLoading =
    isLoadingEntities || isLoadingTasks || isLoadingTaskCompletionForms;

  if (isLoading) {
    return <FullPageSpinner />;
  }

  const orderedItems = [
    ...newEntityIds.map((id) => ({ id, type: 'ENTITY' })),
    ...newTaskIds.map((id) => ({ id, type: 'TASK' })),
    ...newTaskCompletionFormIds.map((id) => ({ id, type: 'TASK_COMPLETION' }))
  ].sort(({ id: idA, type: typeA }, { id: idB, type: typeB }) => {
    const itemA =
      typeA === 'ENTITY'
        ? allEntities?.byId[idA]
        : typeA === 'TASK'
        ? allTasks?.byId[idA]
        : allTaskCompletionForms?.byId[idA];
    const itemB =
      typeB === 'ENTITY'
        ? allEntities?.byId[idB]
        : typeB === 'TASK'
        ? allTasks?.byId[idB]
        : allTaskCompletionForms?.byId[idB];

    if (!itemA) {
      return -1;
    }

    if (!itemB) {
      return 1;
    }

    const timeA = isTaskCompletionForm(itemA)
      ? itemA.completion_datetime
      : itemA.created_at;

    const timeB = isTaskCompletionForm(itemB)
      ? itemB.completion_datetime
      : itemB.created_at;

    return timeA < timeB ? 1 : -1;
  });
  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView style={listStyles.container}>
        {orderedItems.map(({ id, type }) => {
          if (type === 'ENTITY') {
            return <NewEntityCard entityId={id} key={`${type}_${id}`} />;
          }
          if (type === 'TASK') {
            return <NewTaskCard taskId={id} key={`${type}_${id}`} />;
          }
          if (type === 'TASK_COMPLETION') {
            return (
              <NewTaskCompletionCard
                taskCompletionId={id}
                key={`${type}_${id}`}
              />
            );
          }
        })}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

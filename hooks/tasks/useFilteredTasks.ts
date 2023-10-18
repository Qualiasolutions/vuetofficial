import { useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/categories';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { AllCategories, AllEntities } from 'reduxStore/services/api/types';
import {
  selectCompletionFilters,
  selectFilteredCategories,
  selectFilteredTaskTypes,
  selectFilteredUsers
} from 'reduxStore/slices/calendars/selectors';
import { ScheduledTaskResponseType, TaskType } from 'types/tasks';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';
import { TAG_TO_CATEGORY } from './constants';

const filterTask = (
  task: ScheduledTaskResponseType,
  filteredUsers: number[],
  filteredCategories: number[],
  filteredTaskTypes: (TaskType | 'OTHER')[],
  completionFilters: ('COMPLETE' | 'INCOMPLETE')[],
  allCategories: AllCategories,
  allEntities: AllEntities
) => {
  return (
    (!filteredUsers ||
      filteredUsers.length === 0 ||
      task.members.some((member) => filteredUsers?.includes(member))) &&
    (!filteredCategories ||
      filteredCategories.length === 0 ||
      filteredCategories.length === allCategories.ids.length ||
      task.entities.some((entityId) => {
        const entity = allEntities.byId[entityId];
        return entity && filteredCategories.includes(entity.category);
      }) ||
      task.tags.some((tagName) => {
        const tagCategoryName = TAG_TO_CATEGORY[tagName];
        const categoryId =
          tagCategoryName && allCategories.byName[tagCategoryName]?.id;
        return categoryId && filteredCategories.includes(categoryId);
      })) &&
    (!filteredTaskTypes ||
      filteredTaskTypes.length === 0 ||
      filteredTaskTypes.includes(task.type) ||
      (filteredTaskTypes.includes('OTHER') &&
        !['TASK', 'APPOINTMENT'].includes(task.type))) &&
    (!completionFilters ||
      completionFilters.length === 0 ||
      (completionFilters.includes('COMPLETE') &&
        completionFilters.includes('INCOMPLETE')) ||
      (completionFilters.includes('COMPLETE') && task.is_complete) ||
      (completionFilters.includes('INCOMPLETE') &&
        !task.is_complete &&
        (task.action_id || (task && ['TASK', 'DUE_DATE'].includes(task.type)))))
  );
};

const isTask = (
  item?: ScheduledTaskResponseType
): item is ScheduledTaskResponseType => {
  return !!item;
};

export default function useFilteredTasks() {
  const { data: scheduledTasks } = useGetAllScheduledTasksQuery(undefined, {
    selectFromResult: ({ data: taskData }) => ({
      data: taskData
    })
  });

  const { data: entitiesData } = useGetAllEntitiesQuery();
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const users = useSelector(selectFilteredUsers);
  const categories = useSelector(selectFilteredCategories);
  const taskTypes = useSelector(selectFilteredTaskTypes);
  const completionFilters = useSelector(selectCompletionFilters);

  if (
    !entitiesData ||
    !categoriesData ||
    !scheduledTasks ||
    !users ||
    !categories ||
    !taskTypes ||
    !completionFilters
  ) {
    return {};
  }

  const filteredTasks = (
    scheduledTasks.ordered
      .map(({ id, recurrence_index, resourcetype, action_id }) => {
        const recurrenceIndex =
          recurrence_index === null ? -1 : recurrence_index;
        if (['FixedTask'].includes(resourcetype)) {
          return (
            scheduledTasks.byTaskId[id] &&
            scheduledTasks.byTaskId[id][recurrenceIndex]
          );
        }

        if (action_id) {
          return (
            scheduledTasks.byActionId[action_id] &&
            scheduledTasks.byActionId[action_id][recurrenceIndex]
          );
        }
      })
      .filter(
        (task) =>
          task &&
          filterTask(
            task,
            users,
            categories,
            taskTypes,
            completionFilters,
            categoriesData,
            entitiesData
          )
      ) || []
  ).filter(isTask);

  const formatted = formatTasksPerDate(filteredTasks);

  return formatted;
}

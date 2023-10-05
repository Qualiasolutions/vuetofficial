import { createSelector } from '@reduxjs/toolkit';
import { RESOURCE_TYPE_TO_TYPE } from 'constants/ResourceTypes';
import dayjs from 'dayjs';
import { vuetApi } from 'reduxStore/services/api/api';
import entitiesApi from 'reduxStore/services/api/entities';
import routinesApi from 'reduxStore/services/api/routines';
import schoolTermsApi from 'reduxStore/services/api/schoolTerms';
import taskActionsApi from 'reduxStore/services/api/taskActions';
import taskCompletionFormsApi from 'reduxStore/services/api/taskCompletionForms';
import tasksApi from 'reduxStore/services/api/tasks';
import { CategoryName } from 'types/categories';
import { DayType } from 'types/datesAndTimes';
import {
  EntityTypeName,
  isStudentEntity,
  SchoolTermTypeName
} from 'types/entities';

import { getDateStringFromDateObject } from 'utils/datesAndTimes';

import {
  HiddenTagType,
  ScheduledEntityResponseType,
  ScheduledTask,
  ScheduledTaskResponseType,
  TaskType
} from 'types/tasks';
import {
  formatEntitiesPerDate,
  formatTasksPerDate
} from 'utils/formatTasksAndPeriods';
import {
  selectCompletionFilters,
  selectFilteredCategories,
  selectFilteredTaskTypes,
  selectFilteredUsers
} from '../calendars/selectors';
import { selectEntitiesByEntityTypes } from '../entities/selectors';
import INFO_CATEGORY_TAGS from 'constants/InfoCategoryTags';
import { AllCategories, AllEntities } from 'reduxStore/services/api/types';

const TAG_TO_CATEGORY: { [key: string]: CategoryName } = {
  ...INFO_CATEGORY_TAGS,
  SOCIAL_INTERESTS__BIRTHDAY: 'SOCIAL_INTERESTS',
  SOCIAL_INTERESTS__ANNIVERSARY: 'SOCIAL_INTERESTS',
  SOCIAL_INTERESTS__HOLIDAY: 'SOCIAL_INTERESTS',
  PETS_FEEDING: 'PETS',
  PETS_EXERCISE: 'PETS',
  PETS_GROOMING: 'PETS',
  PETS_HEALTH: 'PETS'
};

export const selectTaskById = (id: number) =>
  createSelector(tasksApi.endpoints.getAllTasks.select(), (tasks) => {
    return tasks.data?.byId && tasks.data?.byId[id];
  });

export const selectTaskActionById = (id: number) =>
  createSelector(
    taskActionsApi.endpoints.getAllTaskActions.select(),
    (taskActions) => {
      return (taskActions.data?.byId && taskActions.data?.byId[id]) || null;
    }
  );

export const selectTaskCompletionFormById = (id: number) =>
  createSelector(
    taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(),
    (forms) => {
      return forms.data?.byId && forms.data?.byId[id];
    }
  );

export const selectNewTaskIds = createSelector(
  tasksApi.endpoints.getAllTasks.select(),
  (tasks) => {
    const tasksData = tasks?.data;
    if (!tasksData) {
      return [];
    }
    const reverseSortedIds = [...tasksData.ids].sort((a, b) =>
      a < b ? 1 : -1
    );
    const newIds = [];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    for (const id of reverseSortedIds) {
      if (new Date(tasksData.byId[id].created_at) > threeDaysAgo) {
        newIds.push(id);
        continue;
      }
      // If the latest ID is not new then neathir is anything older
      return newIds;
    }
    return newIds;
  }
);

const ALERTABLE_TYPES = ['TASK', 'DUE_DATE'];

export const selectOverdueTasks = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(),
  taskActionsApi.endpoints.getAllTaskActions.select(),
  taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(),
  taskCompletionFormsApi.endpoints.getTaskActionCompletionForms.select(),
  (tasks, taskActions, taskCompletionForms, taskActionCompletionForms) => {
    const tasksData = tasks?.data;
    const taskActionsData = taskActions?.data;
    const taskCompletionFormsData = taskCompletionForms?.data;
    const taskActionCompletionFormsData = taskActionCompletionForms?.data;

    if (
      !tasksData ||
      !taskActionsData ||
      !taskCompletionFormsData ||
      !taskActionCompletionFormsData
    ) {
      return [];
    }

    const overdueTasks: ScheduledTaskResponseType[] = [];
    for (const {
      id,
      recurrence_index: recIndex,
      action_id: actionId
    } of tasksData.ordered) {
      const recurrenceIndex = recIndex === null ? -1 : recIndex;
      const task = actionId
        ? tasksData.byActionId[actionId][recurrenceIndex]
        : tasksData.byTaskId[id][recurrenceIndex];

      if (!ALERTABLE_TYPES.includes(task.type)) {
        continue;
      }

      const taskDatetimeString =
        task?.start_datetime || task?.start_date || task?.date;
      if (!taskDatetimeString) {
        continue;
      }

      const isComplete = actionId
        ? !!(
            taskActionCompletionFormsData.byActionId[actionId] &&
            taskActionCompletionFormsData.byActionId[actionId][recurrenceIndex]
          )
        : !!(
            taskCompletionFormsData.byTaskId[id] &&
            taskCompletionFormsData.byTaskId[id][recurrenceIndex]
          );

      if (!isComplete) {
        const taskStart = new Date(taskDatetimeString);
        if (
          getDateStringFromDateObject(taskStart) <
            getDateStringFromDateObject(new Date()) &&
          !task.is_complete
        ) {
          overdueTasks.push(task);
        }
        if (taskStart > new Date()) {
          return overdueTasks;
        }
      }
    }

    return overdueTasks;
  }
);

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

export const selectFilteredOverdueTasks = createSelector(
  selectOverdueTasks,
  selectFilteredUsers,
  selectFilteredCategories,
  selectFilteredTaskTypes,
  selectCompletionFilters,
  vuetApi.endpoints.getAllCategories.select(),
  entitiesApi.endpoints.getAllEntities.select(),
  (
    tasks,
    users,
    categories,
    taskTypes,
    completionFilters,
    allCategories,
    allEntities
  ) => {
    const categoriesData = allCategories.data;
    const entitiesData = allEntities.data;

    if (
      !categoriesData ||
      !entitiesData ||
      !users ||
      !categories ||
      !taskTypes ||
      !completionFilters
    ) {
      return [];
    }

    return tasks.filter((task) =>
      filterTask(
        task,
        users,
        categories,
        taskTypes,
        completionFilters,
        categoriesData,
        entitiesData
      )
    );
  }
);

export const selectTasksInDailyRoutines = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(),
  routinesApi.endpoints.getAllRoutines.select(),
  (tasks, routines) => {
    const taskData = tasks.data;
    const routinesData = routines.data;

    if (!taskData || !routinesData) {
      return {};
    }

    const dateTasksPerRoutine: {
      [date: string]: {
        [routine: number]: ScheduledTask[];
      };
    } = {};

    for (const date in taskData.byDate) {
      const dayJsDate = dayjs(date);
      const weekdayName = dayJsDate.format('dddd').toLowerCase() as DayType;

      const dayRoutines =
        routinesData.ids
          .filter((id) => routinesData.byId[id][weekdayName])
          .map((id) => routinesData.byId[id]) || [];

      const routineTasks: { [key: number]: ScheduledTask[] } = {};
      for (const routine of dayRoutines) {
        routineTasks[routine.id] = [];
      }

      const nonRoutineTasks: ScheduledTask[] = [];

      const taskObjects = taskData.byDate[date].map((task) => {
        const recurrenceIndex =
          task.recurrence_index === null ? -1 : task.recurrence_index;
        if (task.action_id) {
          return taskData.byActionId[task.action_id][recurrenceIndex];
        }
        return taskData.byTaskId[task.id][recurrenceIndex];
      });

      const formattedTaskObjects = formatTasksPerDate(taskObjects);
      if (formattedTaskObjects[date]) {
        for (const taskObj of formattedTaskObjects[date]) {
          if (taskObj.start_datetime && taskObj.end_datetime) {
            if (!taskObj.routine) {
              nonRoutineTasks.push(taskObj);
              continue;
            }

            // In this case the task is a fixed task
            const startTime = new Date(taskObj.start_datetime || '');
            const startDate = dayjs(startTime).format('YYYY-MM-DD');
            const endTime = new Date(taskObj.end_datetime || '');
            const endDate = dayjs(endTime).format('YYYY-MM-DD');
            const multiDay = startDate !== endDate;

            if (multiDay) {
              nonRoutineTasks.push(taskObj);
              continue;
            }

            const assignedRoutine = routinesData.byId[taskObj.routine];
            if (
              dayjs(taskObj.start_datetime).format('HH:mm:dd') >=
                assignedRoutine.start_time &&
              dayjs(taskObj.end_datetime).format('HH:mm:dd') <=
                assignedRoutine.end_time
            ) {
              routineTasks[assignedRoutine.id].push(taskObj);
            } else {
              nonRoutineTasks.push(taskObj);
            }
          } else {
            // Otherwise it is a due date and we place
            // it in a routine if it is assigned to one
            if (taskObj.routine) {
              if (taskObj.routine in routineTasks) {
                routineTasks[taskObj.routine].push(taskObj);
                continue;
              }
            }
            nonRoutineTasks.push(taskObj);
          }
        }
      }

      const routineIdsToShow = Object.keys(routineTasks)
        .filter((routineId) => routineTasks[parseInt(routineId)].length > 0)
        .map((id) => parseInt(id));

      for (const routineId of routineIdsToShow) {
        if (!dateTasksPerRoutine[date]) {
          dateTasksPerRoutine[date] = {};
        }
        dateTasksPerRoutine[date][routineId] = routineTasks[routineId];
      }

      if (!dateTasksPerRoutine[date]) {
        dateTasksPerRoutine[date] = {};
      }

      dateTasksPerRoutine[date][-1] = nonRoutineTasks;
    }

    return dateTasksPerRoutine;
  }
);

export const selectTasksForRoutineForDate = (routine: number, date: string) => {
  return createSelector(selectTasksInDailyRoutines, (dailyTasksPerRoutine) => {
    return dailyTasksPerRoutine[date][routine];
  });
};

const isTask = (
  item: ScheduledTaskResponseType | undefined
): item is ScheduledTaskResponseType => {
  return !!item;
};

const isEntity = (
  item: ScheduledEntityResponseType | undefined
): item is ScheduledEntityResponseType => {
  return !!item;
};

const EXTRA_ENTITY_TYPE_ITEMS: {
  [key in EntityTypeName]?: {
    tags?: string[];
    types?: string[];
    entityTypes?: EntityTypeName[];
  };
} = {
  AnniversaryPlan: {
    tags: ['SOCIAL_INTERESTS__BIRTHDAY', 'SOCIAL_INTERESTS__ANNIVERSARY'],
    types: ['BIRTHDAY', 'ANNIVERSARY']
  },
  HolidayPlan: {
    tags: ['SOCIAL_INTERESTS__HOLIDAY'],
    types: ['HOLIDAY']
  },
  Event: {
    entityTypes: ['EventSubentity']
  }
};

export const selectScheduledTaskIdsByEntityTypes = (
  entityTypes: EntityTypeName[]
) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    entitiesApi.endpoints.getAllEntities.select(),
    (scheduledTasks, allEntities) => {
      const entitiesData = allEntities.data;
      const taskData = scheduledTasks.data;
      if (!taskData || !entitiesData) {
        return {};
      }

      const filteredTasks =
        taskData.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return taskData.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !entityTypes ||
              entityTypes.length === 0 ||
              task.entities.some(
                (ent) =>
                  entitiesData.byId[ent] &&
                  entityTypes.includes(entitiesData.byId[ent].resourcetype)
              ) ||
              entityTypes.some((entityType) => {
                const extraItems = EXTRA_ENTITY_TYPE_ITEMS[entityType];
                if (!extraItems) {
                  return false;
                }
                return (
                  (extraItems.tags &&
                    task.tags.some((tag) => extraItems?.tags?.includes(tag))) ||
                  (extraItems.types && extraItems.types.includes(task.type)) ||
                  (extraItems.entityTypes &&
                    task.entities.some(
                      (entityId) =>
                        extraItems.entityTypes &&
                        entitiesData.byId[entityId] &&
                        extraItems.entityTypes.includes(
                          entitiesData.byId[entityId].resourcetype
                        )
                    ))
                );
              })
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

export const selectFilteredScheduledTaskIdsByDate = createSelector(
  tasksApi.endpoints.getAllScheduledTasks.select(),
  entitiesApi.endpoints.getAllEntities.select(),
  vuetApi.endpoints.getAllCategories.select(),
  selectFilteredUsers,
  selectFilteredCategories,
  selectFilteredTaskTypes,
  selectCompletionFilters,
  (
    scheduledTasks,
    allEntities,
    allCategories,
    users,
    categories,
    taskTypes,
    completionFilters
  ) => {
    const entitiesData = allEntities.data;
    const categoriesData = allCategories.data;
    if (!scheduledTasks.data) {
      return {};
    }
    if (
      !entitiesData ||
      !categoriesData ||
      !users ||
      !categories ||
      !taskTypes ||
      !completionFilters
    ) {
      return {};
    }

    const filteredTasks =
      scheduledTasks.data.ordered
        .map(({ id, recurrence_index, resourcetype, action_id }) => {
          const recurrenceIndex =
            recurrence_index === null ? -1 : recurrence_index;
          if (['FixedTask'].includes(resourcetype)) {
            return scheduledTasks.data?.byTaskId[id][recurrenceIndex];
          }

          if (action_id) {
            return scheduledTasks.data?.byActionId[action_id][recurrenceIndex];
          }
        })
        .filter(isTask)
        .filter((task) =>
          filterTask(
            task,
            users,
            categories,
            taskTypes,
            completionFilters,
            categoriesData,
            entitiesData
          )
        ) || [];

    const formatted = formatTasksPerDate(filteredTasks);

    return formatted;
  }
);

const studentSelector = selectEntitiesByEntityTypes(['Student']);

const SCHOOL_ENTITY_TYPES = [
  'SchoolYearStart',
  'SchoolYearEnd',
  'SchoolTerm',
  'SchoolTermStart',
  'SchoolTermEnd',
  'SchoolBreak'
];

export const selectFilteredScheduledEntityIds = (
  resourceTypes?: (EntityTypeName | SchoolTermTypeName)[],
  entityIds?: number[]
) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    entitiesApi.endpoints.getAllEntities.select(),
    schoolTermsApi.endpoints.getAllSchoolYears.select(),
    schoolTermsApi.endpoints.getAllSchoolBreaks.select(),
    schoolTermsApi.endpoints.getAllSchoolTerms.select(),
    vuetApi.endpoints.getAllCategories.select(),
    studentSelector,
    selectFilteredUsers,
    selectFilteredCategories,
    selectFilteredTaskTypes,
    selectCompletionFilters,
    (
      scheduledTasks,
      allEntities,
      schoolYears,
      schoolBreaks,
      schoolTerms,
      allCategories,
      students,
      users,
      categories,
      taskTypes,
      completionFilters
    ) => {
      const schoolYearsData = schoolYears.data;
      const schoolBreaksData = schoolBreaks.data;
      const schoolTermsData = schoolTerms.data;
      const allEntitiesData = allEntities.data;
      const allCategoriesData = allCategories.data;

      if (
        !scheduledTasks.data?.orderedEntities ||
        !schoolYearsData ||
        !schoolBreaksData ||
        !schoolTermsData ||
        !allEntitiesData ||
        !allCategoriesData
      ) {
        return {};
      }

      const filteredEntities =
        scheduledTasks.data.orderedEntities
          .filter(
            ({ resourcetype }) =>
              !resourceTypes || resourceTypes.includes(resourcetype)
          )
          .filter(({ id, resourcetype }) => {
            if (
              entityIds &&
              entityIds.includes(id) &&
              !SCHOOL_ENTITY_TYPES.includes(resourcetype)
            ) {
              // Have exact entity ID match
              return true;
            }

            if (resourceTypes && resourceTypes.includes(resourcetype)) {
              // Have exact resource type match
              return true;
            }

            if (!entityIds && !resourceTypes) {
              // No filtering
              return true;
            }

            if (resourceTypes) {
              // Otherwise if resourceTypes is specified then only return exact resource type matches
              return false;
            }

            // At this point entityIds must be specified
            if (entityIds) {
              let schoolYear = null;
              if (['SchoolYearStart', 'SchoolYearEnd'].includes(resourcetype)) {
                schoolYear = schoolYearsData.byId[id];
              }
              if (
                ['SchoolTermStart', 'SchoolTermEnd', 'SchoolTerm'].includes(
                  resourcetype
                )
              ) {
                const schoolTerm = schoolTermsData.byId[id];
                const schoolYearId = schoolTerm.school_year;
                schoolYear = schoolYearsData.byId[schoolYearId];
              }
              if (['SchoolBreak'].includes(resourcetype)) {
                const schoolBreak = schoolBreaksData.byId[id];
                const schoolYearId = schoolBreak.school_year;
                schoolYear = schoolYearsData.byId[schoolYearId];
              }

              if (schoolYear) {
                if (entityIds.includes(schoolYear.school)) {
                  return true;
                }

                const studentEntityIds = students.filter((studentId) =>
                  entityIds.includes(studentId)
                );

                for (const studentId of studentEntityIds) {
                  const student = allEntitiesData.byId[studentId];

                  if (isStudentEntity(student)) {
                    if (student.school_attended === schoolYear.school) {
                      return true;
                    }
                  }
                }
              }
            }

            return false;
          })
          .map(({ id, resourcetype }) => {
            const type = RESOURCE_TYPE_TO_TYPE[resourcetype] || 'ENTITY';
            return (
              scheduledTasks.data?.byEntityId[type] &&
              scheduledTasks.data?.byEntityId[type][id]
            );
          })
          .filter(isEntity)
          .filter(
            (entity) =>
              (!users ||
                users.length === 0 ||
                entity.members.some((member) => users?.includes(member))) &&
              (!categories ||
                categories.length === 0 ||
                categories.length === allCategoriesData.ids.length ||
                categories.includes(
                  allEntitiesData.byId[entity.id]?.category
                ) ||
                (categories.some(
                  (categoryId) =>
                    allCategoriesData.byId[categoryId].name === 'EDUCATION'
                ) &&
                  SCHOOL_ENTITY_TYPES.includes(entity.resourcetype))) &&
              (!taskTypes ||
                taskTypes.length === 0 ||
                taskTypes.includes('OTHER')) &&
              (!completionFilters ||
                completionFilters.length === 0 ||
                (completionFilters.includes('COMPLETE') &&
                  completionFilters.includes('INCOMPLETE')))
          ) || [];

      const formatted = formatEntitiesPerDate(filteredEntities);

      return formatted;
    }
  );

export const selectScheduledTaskIdsByEntityIds = (entities: number[]) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    entitiesApi.endpoints.getAllEntities.select(),
    (scheduledTasks, allEntities) => {
      if (!scheduledTasks.data) {
        return {};
      }

      if (!allEntities.data) {
        return {};
      }

      const entitiesData = allEntities.data;

      const filteredTasks =
        scheduledTasks.data.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return scheduledTasks.data?.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !entities ||
              entities.length === 0 ||
              task.entities.some((ent) => {
                if (entities?.includes(ent)) {
                  return true;
                }

                const taskEntity = entitiesData.byId[ent];

                if (!taskEntity) {
                  return false;
                }

                const parentEntityId = taskEntity.parent;
                if (parentEntityId && entities?.includes(parentEntityId)) {
                  return true;
                }

                return false;
              })
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

export const selectScheduledTaskIdsByTagNames = (tagNames: string[]) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    (scheduledTasks) => {
      if (!scheduledTasks.data) {
        return {};
      }

      const filteredTasks =
        scheduledTasks.data.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return scheduledTasks.data?.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !tagNames ||
              tagNames.length === 0 ||
              task.tags.some((tagName) => tagNames?.includes(tagName))
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

const EXTRA_CATEGORY_ITEMS: {
  [key in CategoryName]?: {
    tags?: string[];
    types?: string[];
  };
} = {
  SOCIAL_INTERESTS: {
    tags: [
      'SOCIAL_INTERESTS__BIRTHDAY',
      'SOCIAL_INTERESTS__ANNIVERSARY',
      'SOCIAL_INTERESTS__HOLIDAY'
    ],
    types: ['BIRTHDAY', 'ANNIVERSARY', 'HOLIDAY']
  }
};

export const selectScheduledTaskIdsByCategories = (categories: number[]) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    entitiesApi.endpoints.getAllEntities.select(),
    vuetApi.endpoints.getAllCategories.select(),
    (scheduledTasks, allEntities, allCategories) => {
      const entitiesData = allEntities.data;
      const taskData = scheduledTasks.data;
      const allCategoriesData = allCategories.data;
      if (!taskData || !entitiesData) {
        return {};
      }

      const filteredTasks =
        taskData.ordered
          .map(({ id, recurrence_index, resourcetype, action_id }) => {
            const recurrenceIndex =
              recurrence_index === null ? -1 : recurrence_index;
            if (['FixedTask'].includes(resourcetype)) {
              return taskData.byTaskId[id][recurrenceIndex];
            }

            if (action_id) {
              return scheduledTasks.data?.byActionId[action_id][
                recurrenceIndex
              ];
            }
          })
          .filter(isTask)
          .filter(
            (task) =>
              !categories ||
              categories.length === 0 ||
              task.entities.some((ent) =>
                categories.some(
                  (cat) =>
                    entitiesData.byId[ent] &&
                    entitiesData.byId[ent].category === cat
                )
              ) ||
              categories.some((category) => {
                const categoryName = allCategoriesData?.byId[category]?.name;
                if (!categoryName) {
                  return false;
                }

                if (
                  task.tags.some((tagName) => {
                    return TAG_TO_CATEGORY[tagName] === categoryName;
                  })
                ) {
                  return true;
                }

                const extraItems = EXTRA_CATEGORY_ITEMS[categoryName];
                if (!extraItems) {
                  return false;
                }
                return (
                  (extraItems.tags &&
                    task.tags.some((tag) => extraItems?.tags?.includes(tag))) ||
                  (extraItems.types && extraItems.types.includes(task.type))
                );
              })
          ) || [];

      const formatted = formatTasksPerDate(filteredTasks);

      return formatted;
    }
  );

export const selectIsComplete = ({
  id,
  recurrenceIndex,
  actionId
}: {
  id: number;
  recurrenceIndex: number | null;
  actionId: number | null;
}) =>
  createSelector(
    taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(),
    taskCompletionFormsApi.endpoints.getTaskActionCompletionForms.select(),
    (taskCompletionForms, taskActionCompletionForms) => {
      if (actionId) {
        const completionForm =
          taskActionCompletionForms.data?.byActionId[actionId] &&
          taskActionCompletionForms.data?.byActionId[actionId][
            recurrenceIndex === null ? -1 : recurrenceIndex
          ];
        return {
          isComplete: !!completionForm,
          isIgnored: !!(completionForm && completionForm.ignore),
          completionForm
        };
      }
      const completionForm =
        taskCompletionForms.data?.byTaskId[id] &&
        taskCompletionForms.data?.byTaskId[id][
          recurrenceIndex === null ? -1 : recurrenceIndex
        ];
      return {
        isComplete: !!completionForm,
        isIgnored: !!(completionForm && completionForm.ignore),
        completionForm
      };
    }
  );

export const selectScheduledTask = ({
  id,
  recurrenceIndex,
  actionId
}: {
  id?: number | null;
  recurrenceIndex?: number | null;
  actionId?: number | null;
}) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    (scheduledTasks) => {
      const recIndex =
        recurrenceIndex === null || recurrenceIndex === undefined
          ? -1
          : recurrenceIndex;
      if (actionId && scheduledTasks.data?.byActionId[actionId]) {
        return scheduledTasks.data?.byActionId[actionId][recIndex];
      }
      if (id) {
        return (
          scheduledTasks.data?.byTaskId &&
          scheduledTasks.data?.byTaskId[id] &&
          scheduledTasks.data?.byTaskId[id][recIndex]
        );
      }
    }
  );

export const selectScheduledEntity = (id: number, type: string) =>
  createSelector(
    tasksApi.endpoints.getAllScheduledTasks.select(),
    (scheduledTasks) => {
      if (id) {
        return (
          scheduledTasks.data?.byEntityId &&
          scheduledTasks.data?.byEntityId[type] &&
          scheduledTasks.data?.byEntityId[type][id]
        );
      }
    }
  );

export const selectTasksFromEntityAndHiddenTag = (
  entityId: number,
  tagName: HiddenTagType
) =>
  createSelector(tasksApi.endpoints.getAllTasks.select(), (tasks) => {
    const taskData = tasks.data;

    if (!taskData) {
      return [];
    }
    return taskData?.ids
      .filter((id) => {
        const task = taskData.byId[id];
        return task.entities.includes(entityId) && task.hidden_tag === tagName;
      })
      .map((id) => taskData.byId[id]);
  });

export const selectNextTaskFromEntityAndHiddenTag = (
  entityId: number,
  tagName: HiddenTagType
) =>
  createSelector(
    selectTasksFromEntityAndHiddenTag(entityId, tagName),
    taskCompletionFormsApi.endpoints.getTaskCompletionForms.select(),
    (tasks, taskCompletionForms) => {
      const taskCompletionFormData = taskCompletionForms.data;

      if (!taskCompletionFormData) {
        return null;
      }

      const sortedTasks = tasks.sort((taskA, taskB) => {
        const taskAStart = taskA.start_datetime || taskA.date;
        const taskBStart = taskB.start_datetime || taskB.date;
        if (!(taskAStart && taskBStart)) {
          return 0;
        }
        return taskAStart < taskBStart ? -1 : 1;
      });

      const now = new Date();
      for (const task of sortedTasks) {
        if (taskCompletionFormData.byTaskId[task.id]) {
          continue;
        }
        if (task.start_datetime && new Date(task.start_datetime) > now) {
          return task;
        }
        if (task.date && new Date(task.date) > now) {
          return task;
        }
      }

      return null;
    }
  );

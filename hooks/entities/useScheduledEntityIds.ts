import { RESOURCE_TYPE_TO_TYPE } from 'constants/ResourceTypes';
import { useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/categories';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  useGetAllSchoolBreaksQuery,
  useGetAllSchoolTermsQuery,
  useGetAllSchoolYearsQuery
} from 'reduxStore/services/api/schoolTerms';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import {
  selectCompletionFilters,
  selectFilteredCategories,
  selectFilteredTaskTypes,
  selectFilteredUsers
} from 'reduxStore/slices/calendars/selectors';
import { EntityTypeName, SchoolTermTypeName } from 'types/entities';
import { ScheduledEntityResponseType } from 'types/tasks';
import { formatEntitiesPerDate } from 'utils/formatTasksAndPeriods';

const isEntity = (
  item: ScheduledEntityResponseType | undefined
): item is ScheduledEntityResponseType => {
  return !!item;
};

const SCHOOL_ENTITY_TYPES = [
  'SchoolYearStart',
  'SchoolYearEnd',
  'SchoolTerm',
  'SchoolTermStart',
  'SchoolTermEnd',
  'SchoolBreak'
];

export default function useScheduledEntityIds(
  resourceTypes?: (EntityTypeName | SchoolTermTypeName)[],
  entityId?: number
) {
  const { data: scheduledTasks } = useGetAllScheduledTasksQuery();
  const { data: allCategoriesData } = useGetAllCategoriesQuery();
  const { data: schoolYearsData } = useGetAllSchoolYearsQuery();
  const { data: schoolTermsData } = useGetAllSchoolTermsQuery();
  const { data: schoolBreaksData } = useGetAllSchoolBreaksQuery();

  const users = useSelector(selectFilteredUsers);
  const categories = useSelector(selectFilteredCategories);
  const taskTypes = useSelector(selectFilteredTaskTypes);
  const completionFilters = useSelector(selectCompletionFilters);

  const { data: entitiesByCategory } = useGetAllEntitiesQuery(undefined, {
    selectFromResult: ({ data }) => {
      if (!data) {
        return { data: null };
      }
      return {
        data: data.byCategory
      };
    }
  });

  const { data: studentIds } = useGetAllEntitiesQuery(undefined, {
    selectFromResult: ({ data }) => {
      if (!data) {
        return { data: null };
      }
      return {
        data: data.byResourceType.Student
      };
    }
  });

  const { data: entitiesBySchool } = useGetAllEntitiesQuery(undefined, {
    selectFromResult: ({ data }) => {
      if (!data) {
        return { data: null };
      }
      return {
        data: data.bySchoolAttended
      };
    }
  });

  if (
    !scheduledTasks?.orderedEntities ||
    !schoolYearsData ||
    !schoolBreaksData ||
    !schoolTermsData ||
    !entitiesByCategory ||
    !allCategoriesData
  ) {
    return {};
  }

  const filteredEntities =
    scheduledTasks.orderedEntities
      .filter(
        ({ resourcetype }) =>
          !resourceTypes || resourceTypes.includes(resourcetype)
      )
      .filter(({ id, resourcetype }) => {
        if (entityId === id && !SCHOOL_ENTITY_TYPES.includes(resourcetype)) {
          // Have exact entity ID match
          return true;
        }

        if (resourceTypes && resourceTypes.includes(resourcetype)) {
          // Have exact resource type match
          return true;
        }

        if (!entityId && !resourceTypes) {
          // No filtering
          return true;
        }

        if (resourceTypes) {
          // Otherwise if resourceTypes is specified then only return exact resource type matches
          return false;
        }

        // At this point entityId must be specified
        if (entityId) {
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

          if (studentIds && schoolYear && entitiesBySchool) {
            if (entityId === schoolYear.school) {
              return true;
            }

            for (const student of studentIds) {
              if (entitiesBySchool[schoolYear.school]?.includes(student)) {
                return true;
              }
            }
          }
        }

        return false;
      })
      .map(({ id, resourcetype }) => {
        const type = RESOURCE_TYPE_TO_TYPE[resourcetype] || 'ENTITY';
        return (
          scheduledTasks?.byEntityId[type] &&
          scheduledTasks?.byEntityId[type][id]
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
            categories.some((categoryId) =>
              entitiesByCategory[categoryId].includes(entity.id)
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

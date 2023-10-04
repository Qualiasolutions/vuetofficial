import { TaskType } from 'types/tasks';

export interface CalendarState {
  data: {
    filteredUsers: number[];
    filteredEntities: number[];
    filteredTags: string[];
    filteredCategories: number[];
    filteredTaskTypes: (TaskType | 'OTHER')[];
    completionFilters: ('COMPLETE' | 'INCOMPLETE')[];
    taskToAction: {
      taskId: number;
      recurrenceIndex: number | null;
      actionId: number | null;
    } | null;
    taskToPartiallyComplete: {
      taskId: number;
      recurrenceIndex: number | null;
      actionId: number | null;
    } | null;
  };
  ui: {
    filtersModalOpen: boolean;
    enforcedDate: string;
    actionDrawerOpen: boolean;
    lastUpdateId: null | string;
  };
}

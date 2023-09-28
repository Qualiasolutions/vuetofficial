export interface CalendarState {
  data: {
    filteredUsers: number[];
    filteredEntities: number[];
    filteredTags: string[];
    filteredCategories: number[];
    taskToAction: {
      taskId: number;
      recurrenceIndex: number | null;
      actionId: number | null;
    } | null;
  };
  ui: {
    listEnforcedDate: string;
    monthEnforcedDate: string;
    enforcedDate: string;
    actionDrawerOpen: boolean;
  };
}

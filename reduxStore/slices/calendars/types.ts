export interface CalendarState {
  data: {
    filteredUsers: number[];
    filteredEntities: number[];
    filteredTags: string[];
  };
  ui: {
    listEnforcedDate: string;
    monthEnforcedDate: string;
    enforcedDate: string;
  };
}

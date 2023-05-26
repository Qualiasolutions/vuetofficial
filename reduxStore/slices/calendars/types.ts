export interface CalendarState {
  data: {
    filteredUsers: number[];
    filteredEntities: number[];
  };
  ui: {
    listEnforcedDate: string;
    monthEnforcedDate: string;
    enforcedDate: string;
  };
}

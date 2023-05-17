export interface CalendarState {
  data: {};
  ui: {
    selectedTaskId: number;
    selectedPeriodId: number;
    selectedRecurrenceIndex: number;
    selectedReminderId: number;
    listEnforcedDate: string;
    monthEnforcedDate: string;
    enforcedDate: string;
  };
}

export interface FamilyCategoryViewPermission {
  id: number;
  user: number;
  category: number;
}


export interface AllFamilyCategoryViewPermission {
  byId: { [key: number]: FamilyCategoryViewPermission },
  ids: number[]
}


export interface PreferredDaysDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
export type PreferredDays = PreferredDaysDays & {
  id: number;
  user: number;
  category: number;
}


export interface AllPreferredDays {
  byId: { [key: number]: PreferredDays },
  ids: number[]
}
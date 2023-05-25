export interface FamilyCategoryViewPermission {
  id: number;
  user: number;
  category: number;
}


export interface AllFamilyCategoryViewPermission {
  byId: { [key: number]: FamilyCategoryViewPermission },
  ids: number[]
}
import { CategoryName } from "types/categories"

export const idToCategoryMapping: {
  [key: number]: CategoryName
} = {
  1: "FAMILY",
  2: "PETS",
  3: "SOCIAL_INTERESTS",
  4: "EDUCATION_CAREER",
  5: "TRAVEL",
  6: "HEALTH_BEAUTY",
  7: "HOME_GARDEN",
  8: "FINANCE",
  9: "TRANSPORT"
}

export const categoryToIdMapping: {
  [key in CategoryName]: number
} = {
  "FAMILY": 1,
  "PETS": 2,
  "SOCIAL_INTERESTS": 3,
  "EDUCATION_CAREER": 4,
  "TRAVEL": 5,
  "HEALTH_BEAUTY": 6,
  "HOME_GARDEN": 7,
  "FINANCE": 8,
  "TRANSPORT": 9
}

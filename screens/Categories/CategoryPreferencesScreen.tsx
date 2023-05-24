import useEntityTypeHeader from "headers/hooks/useEntityTypeHeader";
import { useGetAllCategoriesQuery } from "reduxStore/services/api/api";
import { EntityTabScreenProps } from "types/base";

type CategoryPreferencesScreenProps = EntityTabScreenProps<'CategoryPreferences'>;

export default function CategoryPreferencesScreen({
  route
}: CategoryPreferencesScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[route.params.categoryId];


  useEntityTypeHeader(categoryData?.name || '');
  return null
}
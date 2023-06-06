import { FullPageSpinner } from 'components/molecules/Spinners';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import { useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { ContentTabScreenProps } from 'types/base';
import EntityCalendarPage from '../../components/calendars/EntityCalendarPage';

type CategoryCalendarScreenProps =
  ContentTabScreenProps<'CategoryCalendarScreen'>;

export default function CategoryCalendarScreen({
  route,
  navigation
}: CategoryCalendarScreenProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const { data: allEntities, isLoading } = useGetAllEntitiesQuery(null as any, {
    skip: !userDetails?.user_id
  });

  useEntityTypeHeader(allCategories?.byId[route.params.categoryId].name || '');

  if (isLoading || !allEntities) {
    return <FullPageSpinner />;
  }

  const categoryEntities = Object.values(allEntities.byId).filter(
    (ent) => ent.category == route.params.categoryId
  );
  const entityIds = categoryEntities.map((ent) => ent.id);

  return <EntityCalendarPage entityIds={entityIds} />;
}

import { FullPageSpinner } from 'components/molecules/Spinners';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { EntityTabScreenProps } from 'types/base';
import EntityCalendarPage from './EntityScreen/components/EntityCalendarPage';

type CategoryCalendarScreenProps =
  EntityTabScreenProps<'CategoryCalendarScreen'>;

export default function CategoryCalendarScreen({
  route,
  navigation
}: CategoryCalendarScreenProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: allEntities, isLoading } = useGetAllEntitiesQuery(
    userDetails?.user_id || -1,
    {
      skip: !userDetails?.user_id
    }
  );

  if (isLoading || !allEntities) {
    return <FullPageSpinner />;
  }

  const categoryEntities = Object.values(allEntities.byId).filter(
    (ent) => ent.category == route.params.categoryId
  );
  const entityIds = categoryEntities.map((ent) => ent.id);

  return <EntityCalendarPage entityIds={entityIds} />;
}

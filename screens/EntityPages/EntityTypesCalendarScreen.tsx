import { FullPageSpinner } from 'components/molecules/Spinners';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { ContentTabScreenProps } from 'types/base';
import EntityCalendarPage from '../../components/calendars/EntityCalendarPage';

type EntityTypesCalendarScreenProps =
  ContentTabScreenProps<'EntityTypesCalendarScreen'>;

export default function EntityTypesCalendarScreen({
  route,
  navigation
}: EntityTypesCalendarScreenProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: allEntities, isLoading } = useGetAllEntitiesQuery(null as any, {
    skip: !userDetails?.user_id
  });

  if (isLoading || !allEntities) {
    return <FullPageSpinner />;
  }

  const categoryEntities = Object.values(allEntities.byId).filter((ent) =>
    route.params.entityTypes.includes(ent.resourcetype)
  );
  const entityIds = categoryEntities.map((ent) => ent.id);

  return <EntityCalendarPage entityIds={entityIds} />;
}

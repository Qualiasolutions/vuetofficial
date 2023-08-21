import { useSelector } from 'react-redux';
import { useGetMemberEntitiesQuery } from 'reduxStore/services/api/entities';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import useGetUserFullDetails from './useGetUserDetails';

export default function useHasEditPerms(taskId: number) {
  const { data: userDetails } = useGetUserFullDetails();
  const { data: memberEntities } = useGetMemberEntitiesQuery(null as any);
  const task = useSelector(selectTaskById(taskId));

  if (userDetails && task?.members.includes(userDetails.id)) {
    return true;
  }
  if (memberEntities) {
    if (task?.entities.some((entityId) => entityId in memberEntities.byId)) {
      return true;
    }
  }
  return false;
}

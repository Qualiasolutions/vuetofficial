import { useSelector } from 'react-redux';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';
import useGetUserFullDetails from './useGetUserDetails';
import useHasEditPerms from './useHasEditPerms';

export default function useCanMarkComplete({
  taskId,
  recurrenceIndex,
  actionId
}: {
  taskId: number;
  recurrenceIndex?: number | null;
  actionId?: number | null;
}) {
  const { data: userDetails } = useGetUserFullDetails();
  const task = useSelector(selectTaskById(taskId));
  const taskToAction = useSelector(
    selectScheduledTask({
      id: taskId,
      recurrenceIndex,
      actionId
    })
  );

  const hasEditPerms = useHasEditPerms(taskId);

  const canMarkComplete =
    userDetails?.is_premium &&
    hasEditPerms &&
    taskToAction &&
    (actionId || (task && ['TASK', 'DUE_DATE'].includes(task.type)));

  return canMarkComplete;
}

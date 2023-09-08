import Calendar from 'components/calendars/TaskCalendar';
import { useSelector } from 'react-redux';
import { selectOverdueTasks } from 'reduxStore/slices/tasks/selectors';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';

export default function OverdueTasksList() {
  const overdueTasks = useSelector(selectOverdueTasks);
  const formattedOverdueTasks = formatTasksPerDate(overdueTasks);

  return (
    <Calendar
      showListHeader={false}
      showAllTime={true}
      filteredTasks={formattedOverdueTasks}
      filteredEntities={{}}
    />
  );
}

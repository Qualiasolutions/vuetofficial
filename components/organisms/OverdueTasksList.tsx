import Calendar from 'components/calendars/TaskCalendar';
import { useSelector } from 'react-redux';
import { selectOverdueTasks } from 'reduxStore/slices/tasks/selectors';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';
import { useThemeColor } from 'components/Themed';

export default function OverdueTasksList() {
  const overdueTasks = useSelector(selectOverdueTasks);
  const formattedOverdueTasks = formatTasksPerDate(overdueTasks);
  const errorBackground = useThemeColor({}, 'errorBackground');
  const whiteColor = useThemeColor({}, 'white');

  return (
    <Calendar
      showListHeader={false}
      showAllTime={true}
      reverse={true}
      headerStyle={{ backgroundColor: errorBackground }}
      headerTextStyle={{ color: whiteColor }}
      filteredTasks={formattedOverdueTasks}
      filteredEntities={{}}
    />
  );
}

import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  AlmostBlackText,
  LightBlackText
} from 'components/molecules/TextComponents';
import { WhiteBox } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { getDateWithoutTimezone } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';

import { getLongDateFromDateObject } from 'utils/datesAndTimes';
import { FixedTaskResponseType, isHolidayTask } from 'types/tasks';
import DatedTaskListPage from 'components/lists/DatedTaskListPage';

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  card: {
    marginTop: 10,
    alignItems: 'center'
  },
  listEntryText: {
    fontSize: 16
  },
  datesText: {
    fontSize: 14
  }
});

function HolidayCard({ task }: { task: FixedTaskResponseType }) {
  const navigation = useNavigation();
  const borderColor = useThemeColor({}, 'almostBlack');

  if (!(task?.start_date && task?.end_date)) {
    return null;
  }

  const startDateString = getLongDateFromDateObject(
    getDateWithoutTimezone(task?.start_date)
  );
  const endDateString = getLongDateFromDateObject(
    getDateWithoutTimezone(task?.end_date)
  );

  return (
    <SafePressable
      onPress={() => {
        (navigation as any).navigate('EditTask', { taskId: task.id });
      }}
    >
      <WhiteBox style={[styles.card, { borderColor }]}>
        <LightBlackText text={task.title || ''} style={styles.listEntryText} />
        <AlmostBlackText
          style={styles.datesText}
          text={`${startDateString}${
            task.end_date !== task.start_date ? ` to ${endDateString}` : ''
          }`}
        />
      </WhiteBox>
    </SafePressable>
  );
}

export default function HolidayDatesScreen() {
  useEntityTypeHeader('holiday-dates');

  const { data: allTasks, isLoading } = useGetAllTasksQuery();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  const holidayTasks = allTasks?.ids
    .map((id) => allTasks.byId[id])
    .filter(isHolidayTask)
    .sort((a, b) =>
      a.start_date && b.start_date && a.start_date < b.start_date ? -1 : 1
    );

  if (!holidayTasks) {
    return null;
  }

  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.container}>
      <DatedTaskListPage tasks={holidayTasks} card={HolidayCard} />
    </TransparentFullPageScrollView>
  );
}

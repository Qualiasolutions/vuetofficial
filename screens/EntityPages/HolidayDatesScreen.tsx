import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import { useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  AlmostBlackText,
  LightBlackText
} from 'components/molecules/TextComponents';
import {
  TransparentPaddedView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { getDateWithoutTimezone } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';

import { getLongDateFromDateObject } from 'utils/datesAndTimes';
import { FixedTaskResponseType } from 'types/tasks';

function HolidayCard({ task }: { task: FixedTaskResponseType }) {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    card: {
      marginTop: 10,
      alignItems: 'center',
      borderColor: useThemeColor({}, 'almostBlack')
    },
    listEntryText: {
      fontSize: 16
    },
    datesText: {
      fontSize: 14
    }
  });

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
      <WhiteBox style={styles.card}>
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
    .filter((task) => ['HOLIDAY'].includes(task.type));

  const cards = holidayTasks?.map((task) => {
    return <HolidayCard task={task} key={task.id} />;
  });

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>{cards}</TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}

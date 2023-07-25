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
import { getDateWithoutTimezone, getDaysToAge } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import SafePressable from 'components/molecules/SafePressable';
import { AnniversaryTaskResponseType, isAnniversaryTask } from 'types/tasks';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';

function AnniversaryCard({ task }: { task: AnniversaryTaskResponseType }) {
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    card: {
      marginTop: 10,
      alignItems: 'center',
      borderColor: useThemeColor({}, 'almostBlack')
    },
    listEntryText: {
      fontSize: 20
    },
    cardSubtitle: { fontSize: 18 }
  });

  if (!task.date) {
    return null;
  }

  const startDate = getDateWithoutTimezone(task.date);

  const { age, monthName, date } = getDaysToAge(startDate);

  return (
    <SafePressable
      onPress={() => {
        (navigation as any).navigate('EditTask', { taskId: task.id });
      }}
    >
      <WhiteBox style={styles.card}>
        <LightBlackText text={task.title || ''} style={styles.listEntryText} />
        <AlmostBlackText
          style={styles.cardSubtitle}
          text={`${task?.known_year ? `${age} on ` : ''}${monthName} ${date}`}
        />
      </WhiteBox>
    </SafePressable>
  );
}

export default function AnniversaryDatesScreen() {
  useEntityTypeHeader('anniversary-dates');

  const { data: allTasks, isLoading } = useGetAllTasksQuery();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  const birthdayTasks = allTasks?.ids
    .map((id) => allTasks.byId[id])
    .filter((task) => ['BIRTHDAY', 'ANNIVERSARY'].includes(task.type));

  const cards = birthdayTasks?.map((task) => {
    if (!isAnniversaryTask(task)) {
      return null;
    }
    return <AnniversaryCard task={task} />;
  });

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>{cards}</TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}

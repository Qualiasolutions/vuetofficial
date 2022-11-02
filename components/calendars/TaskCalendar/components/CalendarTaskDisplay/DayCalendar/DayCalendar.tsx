import { StyleSheet } from 'react-native';

import { View } from 'components/Themed';
import Task from './components/Task';
import { ScheduledTaskParsedType } from 'types/tasks';
import dayjs from 'dayjs';
import { BlackText } from 'components/molecules/TextComponents';
import { ParsedPeriod } from 'types/periods';
import useGetUserDetails from 'hooks/useGetUserDetails';
import OneDayPeriod from './components/OneDayPeriod';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedPeriodId,
  selectSelectedRecurrenceIndex,
  selectSelectedTaskId
} from 'reduxStore/slices/calendars/selectors';
import {
  deselectTasks,
  setSelectedPeriodId,
  setSelectedTaskId
} from 'reduxStore/slices/calendars/actions';

type PropTypes = {
  date: string;
  tasks: ScheduledTaskParsedType[];
  periods: ParsedPeriod[];
  highlight: boolean;
};

export default function DayCalendar({
  date,
  tasks,
  periods,
  highlight
}: PropTypes) {
  const selectedTaskId = useSelector(selectSelectedTaskId);
  const selectedPeriodId = useSelector(selectSelectedPeriodId);
  const selectedRecurrenceIndex = useSelector(selectSelectedRecurrenceIndex);
  const dispatch = useDispatch();

  const taskViews = tasks.map((task, i) => (
    <Task
      task={task}
      key={`${task.id}_${i}`}
      selected={
        task.id === selectedTaskId &&
        (task.recurrence_index === undefined ||
          task.recurrence_index === selectedRecurrenceIndex)
      }
      onPress={(task: ScheduledTaskParsedType) => {
        dispatch(
          setSelectedTaskId({
            taskId: task.id,
            recurrenceIndex:
              Object.keys(task).includes('recurrence_index') &&
              task.recurrence_index !== undefined
                ? task.recurrence_index
                : -1
          })
        );
      }}
      onHeaderPress={() => {
        dispatch(deselectTasks());
      }}
    ></Task>
  ));

  const { data: userDetails } = useGetUserDetails();

  if (!userDetails) {
    return null;
  }

  const oneDayPeriods = periods.filter(
    (period) =>
      period.start_date.toISOString() === period.end_date.toISOString()
  );
  const longPeriods = periods.filter(
    (period) =>
      period.start_date.toISOString() !== period.end_date.toISOString()
  );

  const periodLines = (
    <View style={styles.periodLines}>
      {longPeriods.map((period, i) => (
        <View key={i}>
          <View
            style={[
              styles.periodLine,
              { backgroundColor: `#${userDetails.member_colour}` }
            ]}
          ></View>
        </View>
      ))}
    </View>
  );

  const periodViews = oneDayPeriods.map((period, i) => (
    <OneDayPeriod
      period={period}
      key={`${period.id}_${i}`}
      selected={period.id === selectedPeriodId}
      onPress={(period: ParsedPeriod) => {
        dispatch(
          setSelectedPeriodId({
            periodId: period.id,
            recurrenceIndex: 0
          })
        );
      }}
      onHeaderPress={() => {
        dispatch(deselectTasks());
      }}
    ></OneDayPeriod>
  ));

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftBar}>
          <BlackText
            style={[styles.dateDay, highlight ? styles.highlight : {}]}
            text={dayjs(date).format('MMM') + ' '}
            bold={highlight}
          />
          <BlackText
            style={[styles.dateMonth, highlight ? styles.highlight : {}]}
            text={dayjs(date).format('DD') + ' '}
            bold={highlight}
          />
          {longPeriods.length > 0 ? (
            periodLines
          ) : (
            <View style={styles.verticalLine}></View>
          )}
        </View>
        <View>
          <View style={styles.taskViews}>
            {taskViews}
            {periodViews}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  dateDay: {
    fontSize: 20
  },
  dateMonth: {
    fontSize: 15
  },
  highlight: {
    fontSize: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  verticalLine: {
    width: 1,
    flex: 1,
    flexGrow: 1,
    minHeight: 10,
    backgroundColor: 'black',
    marginVertical: 10
  },
  periodLine: {
    width: 6,
    flex: 1,
    flexGrow: 1,
    minHeight: 10,
    backgroundColor: 'black',
    marginVertical: 10,
    marginHorizontal: 1
  },
  periodLines: {
    flexDirection: 'row',
    flexGrow: 1
  },
  periodLineText: {
    transform: [{ rotate: '270deg' }]
  },
  leftBar: {
    flexGrow: 0,
    marginRight: 20,
    width: 40,
    height: '100%',
    alignItems: 'center'
  },
  taskViews: {
    paddingTop: 30,
    paddingBottom: 60
  }
});

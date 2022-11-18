import { StyleSheet } from 'react-native';

import { View } from 'components/Themed';
import Task from './components/Task';
import { ScheduledTaskParsedType } from 'types/tasks';
import dayjs from 'dayjs';
import { BlackText } from 'components/molecules/TextComponents';
import { ParsedPeriod, ScheduledReminder } from 'types/periods';
import useGetUserDetails from 'hooks/useGetUserDetails';
import OneDayPeriod from './components/OneDayPeriod';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedPeriodId,
  selectSelectedRecurrenceIndex,
  selectSelectedReminderId,
  selectSelectedTaskId
} from 'reduxStore/slices/calendars/selectors';
import {
  deselectTasks,
  setSelectedPeriodId,
  setSelectedReminderId,
  setSelectedTaskId
} from 'reduxStore/slices/calendars/actions';
import Reminder from './components/Reminder';
import { DatePlacedPeriods } from 'utils/calendars';

type ParsedReminder = Omit<ScheduledReminder, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date;
};

type PropTypes = {
  date: string;
  tasks: ScheduledTaskParsedType[];
  periods: ParsedPeriod[];
  markedPeriods: DatePlacedPeriods;
  reminders: ParsedReminder[];
  highlight: boolean;
};

export default function DayCalendar({
  date,
  tasks,
  reminders,
  periods,
  markedPeriods,
  highlight
}: PropTypes) {
  const selectedTaskId = useSelector(selectSelectedTaskId);
  const selectedPeriodId = useSelector(selectSelectedPeriodId);
  const selectedReminderId = useSelector(selectSelectedReminderId);
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

  const periodLines = (
    <View style={styles.periodLines}>
      {
        markedPeriods && markedPeriods.periods &&
        markedPeriods.periods.map((period, i) => (
          <View key={i}>
            <View
              style={[
                styles.periodLine,
                {
                  backgroundColor: period.color,
                  marginTop: period.startingDay ? 10 : 0,
                  marginBottom: period.endingDay ? 10 : 0,
                  borderTopLeftRadius: period.startingDay ? 10 : 0,
                  borderTopRightRadius: period.startingDay ? 10 : 0,
                  borderBottomLeftRadius: period.endingDay ? 10 : 0,
                  borderBottomRightRadius: period.endingDay ? 10 : 0,
                }
              ]}
            ></View>
          </View>
        ))
      }
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

  const reminderViews = reminders.map((reminder, i) => (
    <Reminder
      reminder={reminder}
      key={`${reminder.id}_${i}`}
      selected={reminder.id === selectedReminderId}
      onPress={(reminder) => {
        dispatch(setSelectedReminderId({ reminderId: reminder.id }));
      }}
      onHeaderPress={() => {
        dispatch(deselectTasks());
      }}
    ></Reminder>
  ));

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftBar}>
          <View style={styles.leftBarPeriodLines}>
            {markedPeriods && markedPeriods.periods && periodLines}
          </View>
          <View style={styles.leftBarDate}>
            <BlackText
              style={[styles.dateDay, highlight ? styles.highlight : {}]}
              text={dayjs(date).format('dd') + ' '}
              bold={highlight}
            />
            <BlackText
              style={[styles.dateMonth, highlight ? styles.highlight : {}]}
              text={dayjs(date).format('DD') + ' '}
              bold={highlight}
            />
            <View style={styles.verticalLine}></View>
          </View>
        </View>
        <View style={styles.taskViews}>
          {taskViews}
          {periodViews}
          {reminderViews}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
  verticalLine: {
    width: 1,
    flex: 1,
    flexGrow: 1,
    minHeight: 10,
    backgroundColor: 'black',
    marginVertical: 4
  },
  periodLine: {
    width: 4,
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: 'black',
    marginHorizontal: 1
  },
  periodLines: {
    flexDirection: 'row',
    flexGrow: 1
  },
  leftBar: {
    flexGrow: 0,
    marginRight: 20,
    width: 60,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  leftBarPeriodLines: {
    width: 30,
    flexDirection: 'row',
    height: '100%'
  },
  leftBarDate: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 5
  },
  taskViews: {
    paddingTop: 30,
    paddingBottom: 60,
    flex: 1
  }
});

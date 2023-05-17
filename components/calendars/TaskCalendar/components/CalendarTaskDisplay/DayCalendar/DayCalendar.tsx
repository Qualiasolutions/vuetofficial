import { StyleSheet, ViewStyle } from 'react-native';

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
  deselectTasks,
  setSelectedPeriodId,
  setSelectedReminderId,
} from 'reduxStore/slices/calendars/actions';
import Reminder from './components/Reminder';
import { DatePlacedPeriods } from 'utils/calendars';
import React, { useMemo } from 'react';

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
  style?: ViewStyle;
};

function DayCalendar({
  date,
  highlight,
  tasks,
  reminders,
  periods,
  markedPeriods,
  style
}: PropTypes) {
  console.log("RENDER DAY " + date + " " + Math.random())
  const dispatch = useDispatch();

  const taskViews = useMemo(() => (tasks.map((task, i) => (
    <Task
      task={task}
      key={`${task.id}_${i}`}
    ></Task>
  ))), [tasks]);

  const { data: userDetails } = useGetUserDetails();

  if (!userDetails) {
    return null;
  }

  const oneDayPeriods = useMemo(() => (
    periods.filter(
      (period) =>
        period.start_date.toISOString() === period.end_date.toISOString()
    )),
    [periods]
  );

  const periodViews = useMemo(() => (oneDayPeriods.map((period, i) => (
    <OneDayPeriod
      period={period}
      key={`${period.id}_${i}`}
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
  ))), [oneDayPeriods]);

  const reminderViews = useMemo(() => (reminders.map((reminder, i) => (
    <Reminder
      reminder={reminder}
      key={`${reminder.id}_${i}`}
      onPress={(reminder) => {
        dispatch(setSelectedReminderId({ reminderId: reminder.id }));
      }}
      onHeaderPress={() => {
        dispatch(deselectTasks());
      }}
    ></Reminder>
  ))), [reminders]);

  return (
    <View style={style}>
      <View style={styles.container}>
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
    paddingHorizontal: 10
  },
  highlight: {
    fontSize: 20
  },
  taskViews: {
    paddingTop: 10,
    paddingBottom: 20,
    flex: 1
  }
});

export default React.memo(DayCalendar)

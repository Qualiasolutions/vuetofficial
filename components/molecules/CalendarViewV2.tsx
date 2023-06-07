import { Text, useThemeColor } from 'components/Themed';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
import { useSelector } from 'react-redux';
import {
  selectListEnforcedDate,
  selectScheduledTask
} from 'reduxStore/slices/calendars/selectors';
import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { ParsedPeriod } from 'types/periods';
import { TransparentView } from './ViewComponents';
import { ScrollView } from 'react-native-gesture-handler';
import SafePressable from './SafePressable';

export type CalendarViewProps = {
  tasks: { [date: string]: MinimalScheduledTask[] };
  periods: ParsedPeriod[];
  onChangeDate?: (date: string) => void;
  hidden?: boolean;
};

function useStyle() {
  return StyleSheet.create({
    container: { height: '100%', marginBottom: 0 },
    dayComponent: {
      width: 58,
      height: 70,
      borderWidth: 0.2,
      borderColor: useThemeColor({}, 'almostBlack'),
      margin: 0,
      paddingVertical: 1,
      paddingHorizontal: 2
    },
    dayComponentInnerContainer: {
      height: '100%'
    },
    date: { fontSize: 10, textAlign: 'left' },
    taskText: { fontSize: 8, marginBottom: 1 }
  });
}

const ListedTask = ({
  id,
  recurrenceIndex
}: {
  id: number;
  recurrenceIndex: number | null;
}) => {
  const task = useSelector(selectScheduledTask({ id, recurrenceIndex }));
  const styles = useStyle();
  if (!task) {
    return null;
  }
  return <Text style={styles.taskText}>{task.title}</Text>;
};

const CalendarContent = ({
  onChangeDate,
  tasks,
  periods
}: CalendarViewProps) => {
  const [forcedInitialDate, setForcedInitialDate] = useState<string | null>(
    null
  );
  const styles = useStyle();
  const listEnforcedDate = useSelector(selectListEnforcedDate);
  const whiteColor = useThemeColor({}, 'white');
  const almostWhiteColor = useThemeColor({}, 'almostWhite');
  const currentDayColor = useThemeColor({}, 'lightYellow');

  const updateDate = (newDate: string) => {
    setForcedInitialDate(newDate);
    if (onChangeDate) {
      // Put this in a timeout so that we don't have
      // to wait for updates
      setTimeout(() => {
        onChangeDate(newDate);
      }, 1);
    }
  };

  useEffect(() => {
    setForcedInitialDate(null);
  }, [listEnforcedDate]);

  const currentDate = forcedInitialDate || listEnforcedDate || undefined;

  return (
    <WhiteFullPageScrollView style={styles.container}>
      <Calendar
        minDate={'2012-05-10'}
        pagingEnabled={true}
        horizontal={true}
        style={{ height: 830 }}
        onPressArrowLeft={(cb, date) => {
          cb();
          if (date) {
            updateDate(date.addMonths(-1).toString('yyyy-MM-dd'));
          }
        }}
        onPressArrowRight={(cb, date) => {
          cb();
          if (date) {
            updateDate(date.addMonths(1).toString('yyyy-MM-dd'));
          }
        }}
        initialDate={currentDate}
        dayComponent={({ date }) => {
          if (date) {
            return (
              <SafePressable
                onPress={() => {
                  updateDate(date.dateString);
                  setForcedInitialDate(date.dateString);
                }}
                style={[
                  styles.dayComponent,
                  {
                    backgroundColor:
                      currentDate &&
                      parseInt(currentDate.split('-')[1]) === date.month
                        ? parseInt(currentDate.split('-')[2]) === date.day
                          ? currentDayColor
                          : whiteColor
                        : almostWhiteColor
                  }
                ]}
              >
                <ScrollView>
                  <TransparentView style={styles.dayComponentInnerContainer}>
                    <Text style={[styles.date]}>{date.day}</Text>
                    {tasks[date.dateString] &&
                      tasks[date.dateString].map((task) => (
                        <ListedTask
                          id={task.id}
                          recurrenceIndex={task.recurrence_index}
                          key={`${task.id}_${task.recurrence_index}`}
                        />
                      ))}
                  </TransparentView>
                </ScrollView>
              </SafePressable>
            );
          }
          return null;
        }}
      />
    </WhiteFullPageScrollView>
  );
};

export default function CalendarView({
  onChangeDate,
  tasks,
  periods,
  hidden
}: CalendarViewProps) {
  if (hidden) {
    return null;
  }
  return (
    <CalendarContent
      onChangeDate={onChangeDate}
      tasks={tasks}
      periods={periods}
    />
  );
}

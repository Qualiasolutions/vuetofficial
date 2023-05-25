import { Text, useThemeColor } from 'components/Themed';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
import { useSelector } from 'react-redux';
import { selectListEnforcedDate } from 'reduxStore/slices/calendars/selectors';
import { MinimalScheduledTask } from 'components/calendars/TaskCalendar/components/Task';
import { ParsedPeriod } from 'types/periods';
import formatTasksAndPeriods from 'utils/formatTasksAndPeriods';
import { TransparentView } from './ViewComponents';
import { ScrollView } from 'react-native-gesture-handler';

export type CalendarViewProps = {
  tasks: MinimalScheduledTask[];
  periods: ParsedPeriod[];
  onChangeDate?: (date: string) => void;
};

export default function CalendarView({
  onChangeDate,
  tasks,
  periods
}: CalendarViewProps) {
  const [forcedInitialDate, setForcedInitialDate] = useState<string | null>(
    null
  );
  const styles = style();
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

  const formattedTasks = useMemo(() => {
    return formatTasksAndPeriods(tasks, periods);
  }, [tasks, periods]);

  const currentDate = forcedInitialDate || listEnforcedDate || undefined;

  return (
    <WhiteFullPageScrollView style={styles.container}>
      <Calendar
        minDate={'2012-05-10'}
        pagingEnabled={true}
        horizontal={true}
        style={{ height: 1000 }}
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
              <Pressable
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
                  <TransparentView style={{ height: '100%' }}>
                    <Text style={[styles.date, { color: 'black' }]}>
                      {date.day}
                    </Text>
                    {formattedTasks[date.dateString]?.tasks?.map((task) => (
                      <Text
                        key={`${task.id}_${task.recurrence_index}`}
                        style={styles.taskText}
                      >
                        {task.title}
                      </Text>
                    ))}
                    {formattedTasks[date.dateString]?.periods?.map((period) => (
                      <Text key={period.id} style={styles.taskText}>
                        {period.title}
                      </Text>
                    ))}
                  </TransparentView>
                </ScrollView>
              </Pressable>
            );
          }
          return null;
        }}
      />
    </WhiteFullPageScrollView>
  );
}

function style() {
  return StyleSheet.create({
    container: { height: '100%', marginBottom: 100 },
    dayComponent: {
      width: 58,
      height: 70,
      borderWidth: 0.2,
      borderColor: useThemeColor({}, 'almostBlack'),
      margin: 0,
      paddingVertical: 1,
      paddingHorizontal: 2
    },
    date: { fontSize: 10, textAlign: 'left' },
    taskText: { fontSize: 8, marginBottom: 1 }
  });
}

import { ScrollView, StyleSheet } from 'react-native';
import DayCalendar from './components/DayCalendar/DayCalendar';
import React from 'react';

import {
  getDateStringFromDateObject,
  getDateStringsBetween
} from 'utils/datesAndTimes';

import {
  FixedTaskResponseType,
  FixedTaskParsedType,
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  TaskParsedType,
  isFixedTaskResponseType,
  isFlexibleTaskResponseType,
  TaskResponseType
} from 'types/tasks';
import { SafeAreaView } from 'react-native-safe-area-context';


type SingleDateTasks = {
  dateObj: Date;
  tasks: TaskParsedType[];
};

type AllDateTasks = { [key: string]: SingleDateTasks };

const parseFixedTaskResponse = (
  res: FixedTaskResponseType
): FixedTaskParsedType => {
  return {
    ...res,
    end_datetime: new Date(res.end_datetime),
    start_datetime: new Date(res.start_datetime)
  };
};

const parseFlexibleTaskResponse = (
  res: FlexibleTaskResponseType
): FlexibleTaskParsedType => {
  return {
    ...res,
    due_date: new Date(res.due_date)
  };
};


function Calendar({
  tasks,
  alwaysIncludeCurrentDate=false
}: {
  tasks: TaskResponseType[],
  alwaysIncludeCurrentDate?: boolean
}) {
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});
  const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(null);

  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of Object.values(tasks)) {
      if (isFixedTaskResponseType(task)) {
        const parsedTask: FixedTaskParsedType = parseFixedTaskResponse(task);
        const taskDates = getDateStringsBetween(
          getDateStringFromDateObject(parsedTask.start_datetime),
          getDateStringFromDateObject(parsedTask.end_datetime)
        );
        console.log(parsedTask.start_datetime)
        console.log(parsedTask.end_datetime)
        console.log(taskDates)

        for (const taskDate of taskDates) {
          if (newTasksPerDate[taskDate]) {
            newTasksPerDate[taskDate].tasks.push(parsedTask);
          } else {
            newTasksPerDate[taskDate] = {
              dateObj: new Date(taskDate),
              tasks: [parsedTask]
            };
          }
        }
      } else if (isFlexibleTaskResponseType(task)) {
        const parsedTask: FlexibleTaskParsedType =
          parseFlexibleTaskResponse(task);
        const dueDate = getDateStringFromDateObject(parsedTask.due_date);
        if (newTasksPerDate[dueDate]) {
          newTasksPerDate[dueDate].tasks.push(parsedTask);
        } else {
          newTasksPerDate[dueDate] = {
            dateObj: new Date(parsedTask.due_date),
            tasks: [parsedTask]
          };
        }
      }
    }

    if (alwaysIncludeCurrentDate) {
      const currentDate = new Date();
      const currentDateString = getDateStringFromDateObject(currentDate);
      if (!(currentDateString in newTasksPerDate)) {
        newTasksPerDate[currentDateString] = {
          dateObj: currentDate,
          tasks: []
        };
      }
    }
    setTasksPerDate(newTasksPerDate);
  };

  React.useEffect(formatAndSetTasksPerDate, [tasks]);

  const dayCalendars = Object.keys(tasksPerDate)
    .sort()
    .map((date) => (
      <DayCalendar
        date={tasksPerDate[date].dateObj}
        key={date}
        tasks={tasksPerDate[date].tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
      />
    ));

  return <ScrollView style={styles.container}>{dayCalendars}</ScrollView>;
}
  
const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Calendar
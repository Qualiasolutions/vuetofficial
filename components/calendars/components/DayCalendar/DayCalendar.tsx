import { StyleSheet } from 'react-native';

import { Text, View } from 'components/Themed';
import Task from './components/Task';
import { ScheduledTaskParsedType, TaskParsedType } from 'types/tasks';
import dayjs from 'dayjs';

type PropTypes = {
  date: string;
  tasks: ScheduledTaskParsedType[];
  selectedTaskId: number | null;
  selectedRecurrenceIndex: number | null;
  setSelectedTaskId: Function;
  setSelectedRecurrenceIndex: Function;
};

export default function DayCalendar({
  date,
  tasks,
  selectedTaskId,
  selectedRecurrenceIndex,
  setSelectedTaskId,
  setSelectedRecurrenceIndex
}: PropTypes) {
  const taskViews = tasks.map((task) => (
    <Task
      task={task}
      key={task.id}
      selected={
        task.id === selectedTaskId &&
        task.recurrence_index === selectedRecurrenceIndex
      }
      onPress={(task: ScheduledTaskParsedType) => {
        setSelectedTaskId(task.id);
        setSelectedRecurrenceIndex(task.recurrence_index);
      }}
    ></Task>
  ));
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftBar}>
          <Text style={styles.dateDay}>{dayjs(date).format('MMM')} </Text>
          <Text style={styles.dateMonth}>{dayjs(date).format('DD')} </Text>
          <View style={styles.verticalLine}></View>
        </View>
        <View style={styles.taskViews}>{taskViews}</View>
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
    fontSize: 20,
    fontWeight: 'bold'
  },
  dateMonth: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  verticalLine: {
    width: 2,
    flex: 1,
    flexGrow: 1,
    minHeight: 10,
    backgroundColor: 'black',
    marginVertical: 10
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
    paddingBottom: 60,
    width: '70%'
  }
});

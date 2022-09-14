import { StyleSheet } from 'react-native';

import { View } from 'components/Themed';
import Task from './components/Task';
import { ScheduledTaskParsedType } from 'types/tasks';
import dayjs from 'dayjs';
import { BlackText } from 'components/molecules/TextComponents';

type PropTypes = {
  date: string;
  tasks: ScheduledTaskParsedType[];
  selectedTaskId: number | null;
  selectedRecurrenceIndex: number | null;
  setSelectedTaskId: Function;
  setSelectedRecurrenceIndex: Function;
  highlight: boolean;
};

export default function DayCalendar({
  date,
  tasks,
  selectedTaskId,
  selectedRecurrenceIndex,
  setSelectedTaskId,
  setSelectedRecurrenceIndex,
  highlight
}: PropTypes) {
  const taskViews = tasks.map((task, i) => (
    <Task
      task={task}
      key={`${task.id}_${i}`}
      selected={
        task.id === selectedTaskId &&
        task.recurrence_index === selectedRecurrenceIndex
      }
      onPress={(task: ScheduledTaskParsedType) => {
        setSelectedTaskId(task.id);
        setSelectedRecurrenceIndex(task.recurrence_index);
      }}
      onHeaderPress={() => {
        setSelectedTaskId(null);
        setSelectedRecurrenceIndex(null);
      }}
    ></Task>
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

import { StyleSheet } from 'react-native';

import { Text, View } from 'components/Themed';
import Task from './components/Task';

import { TaskParsedType } from 'types/tasks';

type PropTypes = {
  date: Date;
  tasks: TaskParsedType[];
};

export default function DayCalendar({ date, tasks }: PropTypes) {
  const taskViews = tasks.map((task) => (
    <Task task={task} key={task.id}></Task>
  ));
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.leftBar}>
          <Text style={styles.dateDay}>
            {date.toLocaleString('default', { day: 'numeric' })}{' '}
          </Text>
          <Text style={styles.dateMonth}>
            {date.toLocaleString('default', { month: 'short' })}{' '}
          </Text>
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
    flex: 1,
    flexGrow: 0,
    marginRight: 20,
    height: '100%',
    alignItems: 'center'
  },
  taskViews: {
    paddingTop: 30,
    paddingBottom: 60
  }
});

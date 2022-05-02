import { StyleSheet } from 'react-native';
import { Text, View } from 'components/Themed';
import { TaskParsedType, isFixedTaskParsedType, isFlexibleTaskParsedType } from 'types/tasks'
import { getTimeStringFromDateObject } from 'utils/datesAndTimes'
import Checkbox from 'expo-checkbox';

type PropTypes = {
  task: TaskParsedType
};

export default function Task({ task }: PropTypes) {
  if (isFixedTaskParsedType(task)) {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.leftInfo}>
            <Text> {getTimeStringFromDateObject(task.start_datetime)} </Text>
            <Text> {getTimeStringFromDateObject(task.end_datetime)} </Text>
          </View>
          <Text style={styles.title}> {task.title} </Text>
          <Checkbox
            style={styles.checkbox}
            disabled={false}
            value={true}
            onValueChange={(newValue) => () => { console.log('test') }}
          />
        </View>
        <View style={styles.separator}></View>
      </View>
    );
  } else if (isFlexibleTaskParsedType(task)) {
    return (
      <View style={styles.container}>
        <Text> {task.title} </Text>
        <Text> Due date </Text>
      </View>
    );
  }
  return null
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold'
  },
  leftInfo: {
    marginRight: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkbox: {
    margin: 10,
    height: 25,
    width: 25
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '100%',
    backgroundColor: '#eee'
  },
});

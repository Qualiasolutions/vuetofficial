import { StyleSheet } from 'react-native';
import { Text, View } from 'components/Themed';
import DayCalendar from  './components/DayCalendar/DayCalendar'

export default function CalendarScreen() {
  const currentDate = new Date()

  const getDatesWithTasks = (): Date[] => [] // TODO
  const datesWithTasks = getDatesWithTasks()

  const datesToShow = [currentDate].concat(datesWithTasks)
  const dayCalendars = datesToShow.map(date => <DayCalendar date={date}/>)

  return (
    <View style={styles.container}>
      {dayCalendars}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});

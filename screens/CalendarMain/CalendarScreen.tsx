import Calendar from 'components/calendars/TaskCalendar';
import { SafeAreaView, StatusBar } from 'react-native';

export default function CalendarScreen() {
  return <SafeAreaView style={{
    flex: 1,
    marginTop: StatusBar.currentHeight,
    height: '100%'
  }}>
    <Calendar taskFilters={[]} periodFilters={[]} reminderFilters={[]} fullPage={true} />
  </SafeAreaView>
}

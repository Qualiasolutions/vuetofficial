import { Text, useThemeColor, View } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';

export type CalendarViewProps = {
  dates: {
    [key: string]: { backgroundColor: string; text: string };
  };
};

export default function CalendarView({ dates }: CalendarViewProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const styles = style();

  const calendarTheme = {
    'stylesheet.day.basic': {
      container: {
        margin: 10
      },
      base: {
        width: 58,
        height: 76,
        borderWidth: 0.2,
        borderColor: useThemeColor({}, 'almostBlack'),
        margin: 5,
        padding: 5
      },
      selected: {
        borderRadius: 0,
        backgroundColor: useThemeColor({}, 'almostWhite')
      },
      today: {
        borderRadius: 0
      }
    }
  };
  return (
    <CalendarList
      minDate={'2012-05-10'}
      theme={{
        monthTextColor: primaryColor,
        textMonthFontSize: 16,
        textMonthFontWeight: 'bold',
        selectedDayTextColor: primaryColor,
        ...calendarTheme
      }}
      dayComponent={({ date, state }) => {
        if (date) {
          return (
            <View
              style={[
                styles.dayComponent,
                !!dates[date.dateString] && {
                  backgroundColor: dates[date.dateString]?.backgroundColor
                }
              ]}
            >
              <Text
                style={[
                  styles.date,
                  { color: !!dates[date.dateString] ? primaryColor : 'black' }
                ]}
              >
                {date.day}
              </Text>
              {!!dates[date.dateString] && (
                <Text style={{ fontSize: 10 }}>
                  {dates[date.dateString]?.text}
                </Text>
              )}
            </View>
          );
        }
        return null;
      }}
    />
  );
}

function style() {
  return StyleSheet.create({
    container: {
      height: '100%',
      width: '100%'
    },
    dayComponent: {
      width: 58,
      height: 76,
      borderWidth: 0.2,
      borderColor: useThemeColor({}, 'almostBlack'),
      margin: 5,
      padding: 5
    },
    date: { fontSize: 12, textAlign: 'left' }
  });
}

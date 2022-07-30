import React from 'react';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { CalendarList } from 'react-native-calendars';
import { Text, useThemeColor, View } from 'components/Themed';

function Calendar() {
  const primaryColor = useThemeColor({}, 'primary');
  const styles = style();

  const dates = {
    '2022-08-15': { backgroundColor: '#50cebb', text: 'Annual Leaves' },
    '2022-08-16': { backgroundColor: '#50cebb', text: 'Annual Leaves' },
    '2022-08-21': {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      text: 'Sick Leaves'
    },
    '2022-08-22': {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      text: 'Sick Leaves'
    },
    '2022-08-23': {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      text: 'Sick Leaves'
    },
    '2022-08-24': {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      text: 'Sick Leaves'
    }
  };

  const calanderTheme = {
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
    <WhiteView style={styles.container}>
      <CalendarList
        minDate={'2012-05-10'}
        theme={{
          monthTextColor: primaryColor,
          textMonthFontSize: 16,
          textMonthFontWeight: 'bold',
          selectedDayTextColor: primaryColor,
          ...calanderTheme
        }}
        dayComponent={({ date, state }) => {
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
        }}
      />
    </WhiteView>
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

export default Calendar;

import React from 'react';
import { WhiteView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import CalendarView from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods from 'components/molecules/Periods';

function Calendar() {
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

  const periods = [
    {
      title: 'Your upcoming days off',
      key: 'upcoming-days-off',
      data: [
        {
          title: '9 days - Annual leave',
          message: '1 - 9 July 2022',
          key: 1
        },
        {
          title: '9 days - Annual leave',
          message: '1 - 9 July 2022',
          key: 2
        },
        {
          title: '9 days - Annual leave',
          message: '1 - 9 July 2022',
          key: 3
        }
      ]
    },
    {
      title: 'March 2022',
      key: 'march-2022',
      data: [
        {
          title: '9 days - Annual leave',
          message: '1 - 9 July 2022',
          key: 4
        }
      ]
    }
  ];

  const tabs = [
    {
      title: 'Calendar',
      component: () => <CalendarView dates={dates} />
    },
    {
      title: 'Periods',
      component: () => <Periods periods={periods} />
    }
  ];

  return (
    <WhiteView>
      <Tabs tabs={tabs} />
    </WhiteView>
  );
}

export default Calendar;

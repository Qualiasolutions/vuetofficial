import React from 'react';
import { WhiteView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import CalendarView from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods from 'components/molecules/Periods';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import { getDateStringsBetween } from 'utils/datesAndTimes';
import { CalendarViewProps } from 'reduxStore/services/api/types';
import useGetUserDetails from 'hooks/useGetUserDetails';

function Calendar() {
  const almostWhiteColor = useThemeColor({}, 'almostWhite');

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

  const { data: allPeriods } = useGetScheduledPeriodsQuery(0);
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

  if (!allPeriods) return null;

  let periodsDates: CalendarViewProps;
  for (const p of allPeriods) {
    let datesArray = getDateStringsBetween(p.start_date, p.end_date);
    periodsDates = datesArray.reduce(
      (a, v, i) => ({
        ...a,
        [v]: {
          backgroundColor: almostWhiteColor,
          text: i == 0 ? p.title : '',
          member_colour: userFullDetails?.family.users.find((i) =>
            p.members.includes(i.id)
          )?.member_colour
        }
      }),
      {}
    );
  }
  

  const tabs = [
    {
      title: 'Calendar',
      component: () => <CalendarView dates={periodsDates} />
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

import React from 'react';
import { WhiteView } from 'components/molecules/ViewComponents';
import { useThemeColor } from 'components/Themed';
import CalendarView from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods from 'components/molecules/Periods';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import { getDateStringsBetween, getUTCValuesFromDateString } from 'utils/datesAndTimes';
import { CalendarViewProps, Period } from 'reduxStore/services/api/types';
import useGetUserDetails from 'hooks/useGetUserDetails';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { FullPageSpinner } from 'components/molecules/Spinners';

type CalendarProps = {
  filters?: ((period: Period) => boolean)[];
};

function Calendar({ filters = [] }: CalendarProps) {
  const almostWhiteColor = useThemeColor({}, 'almostWhite');
  const { data: userDetails } = getUserFullDetails();

  const { data: allPeriods } = useGetScheduledPeriodsQuery(
    userDetails?.id || -1,
    {
      skip: !userDetails?.id
    }
  );
  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserDetails();

  if (!allPeriods) return <FullPageSpinner />;

  let filteredPeriods = allPeriods;

  for (const periodFilter of filters) {
    filteredPeriods = filteredPeriods.filter(periodFilter);
  }

  const periodsDates: CalendarViewProps = {};
  for (const p of filteredPeriods) {
    const datesArray = getDateStringsBetween(p.start_date, p.end_date);
    datesArray.forEach((date, i) => {
      periodsDates[date] = {
        backgroundColor: almostWhiteColor,
        text: i == 0 ? p.title : '',
        member_colour:
          userFullDetails?.family.users.find((user) =>
            p.members.includes(user.id)
          )?.member_colour || ''
      };
    });
  }

  const periodData: any = {};
  for (const p of filteredPeriods) {
    const periodStartUtcValues = getUTCValuesFromDateString(p.start_date)
    const periodEndUtcValues = getUTCValuesFromDateString(p.end_date)
    const monthName = `${periodStartUtcValues.monthName} ${periodStartUtcValues.year}`
    const periodFormattedData = {
      title: p.title,
      message: `${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName} - ${periodEndUtcValues.day} ${periodEndUtcValues.monthShortName}`,
      key: p.id
    }
    if (monthName in periodData) {
      periodData[monthName].push(periodFormattedData)
    } else {
      periodData[monthName] = [ periodFormattedData ]
    }
  }

  const formattedPeriodData = Object.keys(periodData).map(monthName => {
    return {
      title: monthName,
      key: monthName,
      data: periodData[monthName]
    }
  })

  const tabs = [
    {
      title: 'Calendar',
      component: () => <CalendarView dates={periodsDates} />
    },
    {
      title: 'Periods',
      component: () => <Periods periods={formattedPeriodData} />
    }
  ];

  return (
    <WhiteView>
      <Tabs tabs={tabs} />
    </WhiteView>
  );
}

export default Calendar;

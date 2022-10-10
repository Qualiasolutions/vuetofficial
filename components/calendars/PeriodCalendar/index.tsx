import React, { useEffect, useState } from 'react';
import { WhiteView } from 'components/molecules/ViewComponents';
import { useThemeColor } from 'components/Themed';
import CalendarView, { CalendarViewProps } from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods from 'components/molecules/Periods';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import { getDateStringsBetween, getUTCValuesFromDateString } from 'utils/datesAndTimes';
import {  Period } from 'reduxStore/services/api/types';
import useGetUserDetails from 'hooks/useGetUserDetails';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { FullPageSpinner } from 'components/molecules/Spinners';

type CalendarProps = {
  filters?: ((period: Period) => boolean)[];
};

function Calendar({ filters = [] }: CalendarProps) {
  const almostWhiteColor = useThemeColor({}, 'almostWhite');
  const { data: userDetails } = getUserFullDetails();

  const [earliestPeriod, setEarliestPeriod] = useState<Date | null>(null)
  const [latestPeriod, setLatestPeriod] = useState<Date | null>(null)

  useEffect(() => {
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    const twoYearsAhead = new Date()
    twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2)
    setEarliestPeriod(twoYearsAgo)
    setLatestPeriod(twoYearsAhead)
  }, [])

  const { data: allPeriods } = useGetScheduledPeriodsQuery(
    {
      user_id: userDetails?.id || -1,
      start_datetime: earliestPeriod?.toISOString() as string,
      end_datetime: latestPeriod?.toISOString() as string,
    },
    { skip: !(userDetails?.id && earliestPeriod && latestPeriod) }
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

  const memberColour = userFullDetails?.member_colour || ''

  const periodsDates: CalendarViewProps["dates"] = {};
  for (const p of filteredPeriods) {
    const datesArray = getDateStringsBetween(p.start_date, p.end_date);
    
    // Let's figure out the row on which we need to show the
    // period, based on the previously placed periods
    let placeIndex = 0
    for (const date of datesArray) {
      const placedPeriods = periodsDates[date]?.periods
      if (!placedPeriods) continue

      for (const period of placedPeriods) {
        if (period.color === 'transparent') {
          break
        }
        placeIndex = Math.max(placedPeriods.indexOf(period) + 1, placeIndex)
      }
    }

    datesArray.forEach((date, i) => {
      const dateData = {
        startingDay: i === 0,
        endingDay: i === (datesArray.length - 1),
        color: `#${memberColour}`,
        id: p.id
      }
      if (!periodsDates[date]) {
        periodsDates[date] = {
          periods: []
        }
      }
      if (!periodsDates[date].periods) {
        periodsDates[date].periods = []
      }
      while (periodsDates[date].periods.length < placeIndex) {
        periodsDates[date].periods.push({ color: 'transparent' })
      }
      periodsDates[date].periods.push(dateData)
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

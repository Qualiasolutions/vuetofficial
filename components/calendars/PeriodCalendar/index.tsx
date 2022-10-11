import React from 'react';
import { WhiteView } from 'components/molecules/ViewComponents';
import CalendarView, { CalendarViewProps } from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods from 'components/molecules/Periods';
import { getDateStringsBetween, getUTCValuesFromDateString } from 'utils/datesAndTimes';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { FullPageSpinner } from 'components/molecules/Spinners';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { PeriodResponse } from 'types/periods';

type CalendarProps = {
  filters?: ((period: PeriodResponse) => boolean)[];
};

function Calendar({ filters = [] }: CalendarProps) {
  const allPeriods = useScheduledPeriods()

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

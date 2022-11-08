import React, { useMemo } from 'react';
import { TransparentView } from 'components/molecules/ViewComponents';
import CalendarView, {
  CalendarViewProps
} from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods, { PeriodData } from 'components/molecules/Periods';
import {
  getDateStringsBetween,
  getUTCValuesFromDateString
} from 'utils/datesAndTimes';
import { FullPageSpinner } from 'components/molecules/Spinners';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { PeriodResponse } from 'types/periods';
import { useThemeColor } from 'components/Themed';

type CalendarProps = {
  filters?: ((period: PeriodResponse) => boolean)[];
};

function Calendar({ filters = [] }: CalendarProps) {
  const { periods: allPeriods, reminders: allReminders } =
    useScheduledPeriods();
  const periodColour = useThemeColor({}, 'mediumLightGrey');

  const filteredPeriods = useMemo(() => {
    if (!allPeriods) {
      return [];
    }

    let filtered = allPeriods;
    for (const periodFilter of filters) {
      filtered = filtered.filter(periodFilter);
    }

    return filtered;
  }, [allPeriods]);

  if (!allPeriods) return <FullPageSpinner />;

  const periodsDates: CalendarViewProps['dates'] = {};
  for (const p of filteredPeriods) {
    const datesArray = getDateStringsBetween(p.start_date, p.end_date);

    // Let's figure out the row on which we need to show the
    // period, based on the previously placed periods
    let placeIndex = 0;
    for (const date of datesArray) {
      const placedPeriods = periodsDates[date]?.periods;
      if (!placedPeriods) continue;

      for (const period of placedPeriods) {
        if (period.color === 'transparent') {
          break;
        }
        placeIndex = Math.max(placedPeriods.indexOf(period) + 1, placeIndex);
      }
    }

    datesArray.forEach((date, i) => {
      const dateData = {
        startingDay: i === 0,
        endingDay: i === datesArray.length - 1,
        color: periodColour,
        id: p.id
      };
      if (!periodsDates[date]) {
        periodsDates[date] = {
          periods: []
        };
      }
      if (!periodsDates[date].periods) {
        periodsDates[date].periods = [];
      }
      while (periodsDates[date].periods.length < placeIndex) {
        periodsDates[date].periods.push({ color: 'transparent' });
      }
      periodsDates[date].periods.push(dateData);
    });
  }

  const periodData: {
    [key: string]: PeriodData;
  } = {};
  for (const p of filteredPeriods) {
    const periodStartUtcValues = getUTCValuesFromDateString(p.start_date);
    const periodEndUtcValues = getUTCValuesFromDateString(p.end_date);
    const monthName = `${periodStartUtcValues.monthName} ${periodStartUtcValues.year}`;

    const message =
      periodStartUtcValues.day === periodEndUtcValues.day &&
      periodStartUtcValues.monthShortName === periodEndUtcValues.monthShortName
        ? `${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName}`
        : `${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName} - ${periodEndUtcValues.day} ${periodEndUtcValues.monthShortName}`;

    const periodFormattedData = {
      title: p.title,
      message,
      key: p.id,
      date: p.start_date
    };
    if (monthName in periodData) {
      periodData[monthName].push(periodFormattedData);
    } else {
      periodData[monthName] = [periodFormattedData];
    }
  }

  const formattedPeriodData = Object.keys(periodData).map((monthName) => {
    return {
      title: monthName,
      key: monthName,
      data: periodData[monthName],
      date: periodData[monthName][0].date
    };
  });

  const tabs = [
    {
      title: 'Calendar Format',
      component: () => <CalendarView dates={periodsDates} />
    },
    {
      title: 'List Format',
      component: () => <Periods periods={formattedPeriodData} />
    }
  ];

  return (
    <TransparentView>
      <Tabs tabs={tabs} />
    </TransparentView>
  );
}

export default Calendar;

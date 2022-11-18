import { CalendarViewProps } from "components/molecules/CalendarView";
import { PeriodResponse } from "types/periods";
import { getDateStringsBetween } from "./datesAndTimes";

export type DatePlacedPeriods = {
  periods: {
    startingDay?: boolean | undefined;
    endingDay?: boolean | undefined;
    color: string;
    id?: number | undefined;
  }[];
  selected?: boolean | undefined;
  selectedColor?: string | undefined;
}
export type PlacedPeriods = {
  [date: string]: DatePlacedPeriods
}

export const placeOverlappingPeriods = (filteredPeriods: PeriodResponse[], periodColour: string): PlacedPeriods => {
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
  return periodsDates
}
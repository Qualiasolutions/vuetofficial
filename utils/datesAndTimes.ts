import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const getDateStringFromDateObject = (
  date: Date,
  utc: boolean = false
): string => {
  const dayjsFunction = utc ? dayjs.utc : dayjs;
  return dayjsFunction(date).format('YYYY-MM-DD');
};

const getTimeStringFromDateObject = (date: Date): string => {
  return dayjs(date).format('HH:mm');
};

const getDateWithoutTimezone = (date: string): Date => {
  return new Date(`${date}T00:00:00`);
};

const getLongDateFromDateObject = (date: Date, utc: boolean = true): string => {
  if (utc) {
    return dayjs.utc(date).format('MMM DD, YYYY');
  }
  return dayjs(date).format('MMM DD, YYYY');
};

const getDatesPeriodString = (startDate: Date, endDate: Date): string => {
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameDate =
    getLongDateFromDateObject(startDate) === getLongDateFromDateObject(endDate);

  if (sameDate) {
    return getLongDateFromDateObject(startDate);
  }

  if (sameYear) {
    return `${dayjs(startDate).format('MMM DD')} - ${dayjs(endDate).format(
      'MMM DD YYYY'
    )}`;
  }

  return `${getLongDateFromDateObject(startDate)} - ${getLongDateFromDateObject(
    endDate
  )}`;
};

type UTCValues = {
  day: number;
  month: number;
  monthShortName: string;
  monthName: string;
  year: number;
};

const getUTCValuesFromDateString = (date: string): UTCValues => {
  const utcDate = getDateWithoutTimezone(date);
  const dayJsDate = dayjs.utc(utcDate);

  return {
    day: dayJsDate.date(),
    month: dayJsDate.month(),
    monthShortName: dayJsDate.format('MMM'),
    monthName: dayJsDate.format('MMMM'),
    year: dayJsDate.year()
  };
};

const getUTCValuesFromDateTimeString = (datetime: string): UTCValues => {
  const utcDate = new Date(datetime);
  const dayJsDate = dayjs.utc(utcDate);

  return {
    day: dayJsDate.date(),
    month: dayJsDate.month(),
    monthShortName: dayJsDate.format('MMM'),
    monthName: dayJsDate.format('MMMM'),
    year: dayJsDate.year()
  };
};

const getDatesBetween = (
  start: string | Date,
  end: string | Date,
  utc: boolean = false
): Date[] => {
  const datesArray = [];
  const dayjsFunction = utc ? dayjs.utc : dayjs;
  for (
    let dt = dayjsFunction(start).toDate();
    dt <= dayjsFunction(end).toDate();
    dt.setDate(dt.getDate() + 1)
  ) {
    datesArray.push(dayjsFunction(dt).toDate());
  }
  return datesArray;
};

const getDateStringsBetween = (
  start: string | Date,
  end: string | Date,
  utc: boolean = false
): string[] => {
  const datesArray = getDatesBetween(start, end, utc);
  return datesArray.map((date) => getDateStringFromDateObject(date, utc));
};

function getNextDate(startDate: Date): Date {
  const startDateCopy = new Date(startDate.getTime());
  const dateNow = new Date();
  while (startDateCopy < dateNow) {
    // Pretty inefficient
    startDateCopy.setFullYear(startDateCopy.getFullYear() + 1);
  }
  return startDateCopy;
}

function getDaysToAge(startDate: Date): {
  days: number;
  age: number;
  month: number;
  monthName: string;
  date: number;
  year: number;
} {
  const nextOccurrence = getNextDate(startDate);
  const todayDate = new Date();
  const millisecondsDifference = nextOccurrence.getTime() - todayDate.getTime();
  const daysDifference = Math.ceil(
    millisecondsDifference / (1000 * 60 * 60 * 24)
  );

  const nextYear = nextOccurrence.getUTCFullYear();
  const age = nextYear - startDate.getUTCFullYear();

  const monthName = dayjs.utc(nextOccurrence).format('MMMM');

  return {
    days: daysDifference,
    age,
    date: nextOccurrence.getUTCDate(),
    month: nextOccurrence.getUTCMonth() + 1,
    monthName,
    year: nextYear
  };
}

export {
  getDateStringFromDateObject,
  getTimeStringFromDateObject,
  getDateWithoutTimezone,
  getLongDateFromDateObject,
  getDatesPeriodString,
  getUTCValuesFromDateString,
  getUTCValuesFromDateTimeString,
  getDatesBetween,
  getDateStringsBetween,
  getDaysToAge,
  getNextDate
};

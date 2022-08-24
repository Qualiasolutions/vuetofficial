import dayjs from 'dayjs';
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const getDateStringFromDateObject = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

const getTimeStringFromDateObject = (date: Date): string => {
  return dayjs(date).format('HH:mm');
};

const getDateWithoutTimezone = (date: string): Date => {
  return new Date(`${date}T00:00:00`);
};

const getLongDateFromDateObject = (date: Date): string => {
  return `${date.getUTCMonth()} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
  return dayjs(date).format('MMM DD, YYYY');
};

const getDatesBetween = (start: string | Date, end: string | Date): Date[] => {
  const datesArray = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    datesArray.push(new Date(dt));
  }
  return datesArray;
};

const getDateStringsBetween = (
  start: string | Date,
  end: string | Date
): string[] => {
  const datesArray = getDatesBetween(start, end);
  return datesArray.map((date) => getDateStringFromDateObject(date));
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

  return {
    days: daysDifference,
    age,
    date: nextOccurrence.getUTCDate(),
    month: nextOccurrence.getUTCMonth() + 1,
    monthName: monthNames[nextOccurrence.getUTCMonth()],
    year: nextYear
  };
}

export {
  getDateStringFromDateObject,
  getTimeStringFromDateObject,
  getDateWithoutTimezone,
  getLongDateFromDateObject,
  getDatesBetween,
  getDateStringsBetween,
  getDaysToAge,
  getNextDate
};

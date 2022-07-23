import dayjs from 'dayjs';

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

export {
  getDateStringFromDateObject,
  getTimeStringFromDateObject,
  getDateWithoutTimezone,
  getLongDateFromDateObject,
  getDatesBetween,
  getDateStringsBetween
};

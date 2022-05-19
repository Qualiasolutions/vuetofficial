import moment from 'moment'

const getDateStringFromDateObject = (date: Date): string => {
  console.log(date)
  console.log(moment(date).format('YYYY-MM-DD'))
  return moment(date).format('YYYY-MM-DD')
};

const getTimeStringFromDateObject = (date: Date): string => {
  return date.toISOString().slice(11, 16);
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
  getDatesBetween,
  getDateStringsBetween
};

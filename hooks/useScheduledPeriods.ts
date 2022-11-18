import { useEffect, useState } from 'react';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import { PeriodReminder, ScheduledReminder } from 'types/periods';
import getUserFullDetails from './useGetUserDetails';

export default function useScheduledPeriods(
  start_datetime?: string,
  end_datetime?: string,
  skip?: boolean
) {
  const [earliestPeriod, setEarliestPeriod] = useState<Date | null>(null);
  const [latestPeriod, setLatestPeriod] = useState<Date | null>(null);

  const { data: userDetails } = getUserFullDetails();

  useEffect(() => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const twoYearsAhead = new Date();
    twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2);
    setEarliestPeriod(twoYearsAgo);
    setLatestPeriod(twoYearsAhead);
  }, []);

  const { data: allPeriods } = useGetScheduledPeriodsQuery(
    {
      user_id: userDetails?.id || -1,
      start_datetime: (start_datetime ||
        earliestPeriod?.toISOString()) as string,
      end_datetime: (end_datetime || latestPeriod?.toISOString()) as string
    },
    {
      skip: skip || !(userDetails?.id && earliestPeriod && latestPeriod),
      pollingInterval: 30000
    }
  );

  const allReminders = [];
  if (allPeriods) {
    for (const period of allPeriods) {
      for (const reminder of period.reminders) {
        allReminders.push({
          ...reminder,
          entity: period.entity,
          start_date: reminder.reminder_date,
          end_date: reminder.reminder_date,
          members: period.members
        } as ScheduledReminder);
      }
    }
  }

  return allPeriods
    ? {
        periods: allPeriods,
        reminders: allReminders
      }
    : {
        periods: [],
        reminders: []
      };
}

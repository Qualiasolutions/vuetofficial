import { useEffect, useState } from 'react';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import useGetUserFullDetails from './useGetUserDetails';

export default function useScheduledPeriods(
  start_datetime?: string,
  end_datetime?: string,
  skip?: boolean
) {
  const [earliestPeriod, setEarliestPeriod] = useState<Date | null>(null);
  const [latestPeriod, setLatestPeriod] = useState<Date | null>(null);

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();

  useEffect(() => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const twoYearsAhead = new Date();
    twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2);
    setEarliestPeriod(twoYearsAgo);
    setLatestPeriod(twoYearsAhead);
  }, []);

  const { data: allPeriods, isLoading: isLoadingPeriods } =
    useGetScheduledPeriodsQuery(
      {
        start_datetime: (start_datetime ||
          earliestPeriod?.toISOString()) as string,
        end_datetime: (end_datetime || latestPeriod?.toISOString()) as string
      },
      {
        skip: skip || !(userDetails?.id && earliestPeriod && latestPeriod)
      }
    );

  return allPeriods
    ? {
        periods: allPeriods,
        isLoading: isLoadingPeriods || isLoadingUserDetails
      }
    : {
        periods: [],
        isLoading: isLoadingPeriods || isLoadingUserDetails
      };
}

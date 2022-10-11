import { useEffect, useState } from "react"
import { useGetScheduledPeriodsQuery } from "reduxStore/services/api/period"
import getUserFullDetails from "./useGetUserDetails";

export default function getScheduledPeriods() {
  const [earliestPeriod, setEarliestPeriod] = useState<Date | null>(null)
  const [latestPeriod, setLatestPeriod] = useState<Date | null>(null)

  const { data: userDetails } = getUserFullDetails();

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

  return allPeriods || null
}
import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useGetHolidaysQuery,
  useGetSelectedHolidayQuery,
  useSaveHolidayMutation,
  useUpdateHolidayMutation
} from 'reduxStore/services/api/holidays';
import { Holiday } from 'reduxStore/services/api/types';
import { WhiteView } from 'components/molecules/ViewComponents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import useGetUserDetails from 'hooks/useGetUserDetails';

export default function HolidayDetailScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'HolidayDetail'>) {
  const { countrycodes } = route?.params;
  let params = '';

  if (typeof countrycodes === 'string') {
    for (const code of (countrycodes as string).split(',')) {
      params = `${params}country_codes=${code}&`;
    }
  } else {
    for (const code of countrycodes) {
      params = `${params}country_codes=${code}&`;
    }
  }

  const { data: userDetails } = useGetUserDetails();
  const { data: previouslySelectedHolidays } = useGetSelectedHolidayQuery(
    userDetails?.id || -1,
    {
      skip: !userDetails?.id
    }
  );

  // TODO - do we want to allow settings holidays for other years too?
  const [selectedHolidays, setSelectedHolidays] = useState<Holiday[]>([]);
  const [saveHoliday] = useSaveHolidayMutation();
  const [updateHoliday] = useUpdateHolidayMutation();
  const {
    data: holidays,
    isError,
    error
  } = useGetHolidaysQuery(`${params}years=${new Date().getFullYear()}`);

  useEffect(() => {
    if (
      previouslySelectedHolidays &&
      previouslySelectedHolidays.length > 0 &&
      holidays
    ) {
      setSelectedHolidays(
        Object.values(holidays)
          .flat()
          .filter((hol: Holiday) =>
            previouslySelectedHolidays[0].holiday_ids.includes(hol.id)
          )
      );
    }
  }, [previouslySelectedHolidays, holidays]);

  const onPress = useCallback(
    (country, selected) => {
      if (selected) {
        setSelectedHolidays(
          selectedHolidays.filter((cou) => cou.id != country.id)
        );
      } else {
        setSelectedHolidays([...selectedHolidays, country]);
      }
    },
    [setSelectedHolidays, selectedHolidays]
  );

  useEffect(() => {
    const save = async () => {
      const body = {
        country_codes:
          typeof countrycodes === 'string' ? [countrycodes] : countrycodes,
        holiday_ids: selectedHolidays.map((holiday) => holiday.id)
      };

      if (previouslySelectedHolidays) {
        if (previouslySelectedHolidays.length > 0) {
          await updateHoliday({
            ...body,
            id: previouslySelectedHolidays[0].id
          });
        } else {
          await saveHoliday(body);
        }
      }
    };

    navigation.setOptions({
      headerRight: () => <AlmostBlackText text="save" onPress={save} />
    });
  }, [selectedHolidays, previouslySelectedHolidays]);

  if (!holidays) return null;

  return (
    <WhiteView style={{ flex: 1 }}>
      <WhiteFullPageScrollView>
        {Object.values(holidays)
          .flat()
          .map((holiday: Holiday) => {
            return (
              <ListLinkWithCheckbox
                key={holiday.id}
                text={holiday.name}
                subText={`${holiday.start_date}${holiday.end_date !== holiday.start_date ? ` to ${holiday.end_date}` : ''}`}
                showArrow={false}
                onSelect={async (selected) => onPress(holiday, selected)}
                navMethod={undefined}
                selected={selectedHolidays.some((cou) => cou.id == holiday.id)}
                disabled={true}
              />
            );
          })}
      </WhiteFullPageScrollView>
    </WhiteView>
  );
}

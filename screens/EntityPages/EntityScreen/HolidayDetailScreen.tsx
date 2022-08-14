import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useGetHolidaysQuery,
  useGetSelectedHolidayQuery,
  useSaveHolidayMutation
} from 'reduxStore/services/api/countries';
import { holiday } from 'reduxStore/services/api/types';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';
import { AlmostBlackText } from 'components/molecules/TextComponents';

export default function HolidayDetailScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'HolidayDetail'>) {
  const { countrycodes } = route?.params;
  let params = '';

  for (const code of countrycodes) {
    params = `${params}country_codes=${code}&`;
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <AlmostBlackText text="save" onPress={save} />
    });
  }, []);

  const styles = stylesFun();
  const [selectedHolidays, setSelectedHolidays] = useState<holiday[]>([]);
  const [saveHoliday] = useSaveHolidayMutation();

  const {
    data: holidays,
    isError,
    error
  } = useGetHolidaysQuery(`${params}years=${new Date().getFullYear()}`);

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

  async function save() {
    let body = {
      country_codes: countrycodes,
      holiday_ids: selectedHolidays.map((holiday) => holiday.id)
    };
    const res = await saveHoliday(body);
  }

  if (!holidays) return null;

  return (
    <WhiteView style={{ flex: 1 }}>
      <WhiteFullPageScrollView>
        {Object.values(holidays)
          .flat()
          .map((holiday: holiday) => {
            return (
              <ListLinkWithCheckbox
                key={holiday.id}
                text={holiday.name}
                subText={holiday.date}
                showArrow={false}
                onSelect={async (selected) => onPress(holiday, selected)}
                navMethod={undefined}
                customOnPress={() =>
                  (navigation as any).push('EntityScreen', {
                    entityId: holiday.id
                  })
                }
                selected={selectedHolidays.some((cou) => cou.id == holiday.id)}
              />
            );
          })}
      </WhiteFullPageScrollView>
    </WhiteView>
  );
}

const stylesFun = function () {
  return StyleSheet.create({});
};

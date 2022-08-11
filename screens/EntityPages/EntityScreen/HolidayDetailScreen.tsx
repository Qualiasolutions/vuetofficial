import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useState } from 'react';
import { useGetHolidaysQuery } from 'reduxStore/services/api/countries';
import { holiday } from 'reduxStore/services/api/types';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';

export default function HolidayDetailScreen({
  route
}: NativeStackScreenProps<EntityTabParamList, 'HolidayDetail'>) {
    const { countrycodes } = route?.params
    let params = ''
    
    for(const code of countrycodes){
        params = `${params}country_codes=${code}&`
    }
    
  const styles = stylesFun();
  const [selectedCountries, setSelectedCountries] = useState<holiday[]>(
    []
  );
  
  const {
    data: holidays,
    isError,
    error
  } = useGetHolidaysQuery(`${params}years=${new Date().getFullYear()}`);

  const onPress = useCallback(
    (country, selected) => {
      if (selected) {
        setSelectedCountries(selectedCountries.filter(cou => cou.id != country.id));
      } else {
        setSelectedCountries([...selectedCountries, country]);
      }
    },
    [setSelectedCountries, selectedCountries]
  );

  if(!holidays) return null;

  return <WhiteView style={{ flex: 1 }}>
     <WhiteFullPageScrollView>
        {Object.values(holidays).flat().map((holiday: holiday) => (
          <ListLinkWithCheckbox
            key={holiday.id}
            text={holiday.name}
            subText={holiday.date}
            showArrow={false}
            onSelect={async (selected) => onPress(holiday, selected)}
            navMethod={undefined}
            customOnPress={() => {}}
            selected={selectedCountries.some(cou => cou.id == holiday.id)}
          />
        ))}
      </WhiteFullPageScrollView>
  </WhiteView>;
}

const stylesFun = function () {
  return StyleSheet.create({});
};

import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetHolidaysQuery } from 'reduxStore/services/api/countries';
import { AllCountries, holiday } from 'reduxStore/services/api/types';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import GenericButton from 'components/molecules/GenericButton';
import { useThemeColor } from 'components/Themed';
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
    
//   const username = useSelector(selectUsername);
  const styles = stylesFun();
//   const { data: userDetails } = useGetUserDetailsQuery(username);
  const [selectedCountries, setSelectedCountries] = useState<AllCountries[]>(
    []
  );
  
  const {
    data: holidays,
    isError,
    error
  } = useGetHolidaysQuery(`${params}years=${new Date().getFullYear()}`);

  const whiteColor = useThemeColor({}, 'white');

  const onPress = useCallback(
    (country, selected) => {
      if (selected) {
        setSelectedCountries(selectedCountries.filter(country.code));
      } else {
        setSelectedCountries([...selectedCountries, country]);
      }
    },
    [setSelectedCountries, selectedCountries]
  );
  console.log(holidays);

  if(!holidays) return null;

  console.log(Object.values(holidays));
  

  return <WhiteView style={{ flex: 1 }}>
     <WhiteFullPageScrollView>
        {Object.values(holidays)[0]?.map((holiday: holiday) => (
          <ListLinkWithCheckbox
            key={holiday.id}
            text={holiday.name}
            showArrow={false}
            onSelect={async (selected) => onPress(holiday, selected)}
            navMethod={undefined}
            customOnPress={() => {}}
          />
        ))}
      </WhiteFullPageScrollView>
  </WhiteView>;
}

const stylesFun = function () {
  return StyleSheet.create({});
};

import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllCountriesQuery } from 'reduxStore/services/api/countries';
import { AllCountries } from 'reduxStore/services/api/types';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import GenericButton from 'components/molecules/GenericButton';
import { useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export default function HolidayListScreen({ navigation }: NativeStackScreenProps<any>) {
  const username = useSelector(selectUsername);
  const styles = stylesFun();
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const [selectedCountries, setSelectedCountries] = useState<AllCountries[]>(
    []
  );
  const {
    data: allCountries,
    isError,
    error
  } = useGetAllCountriesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const whiteColor = useThemeColor({}, 'white');

  const onPress = useCallback(
    (country, selected) => {
      if (selectedCountries.some(cou => cou.code == country.code)) {
        setSelectedCountries(selectedCountries.filter(cou => cou.code != country.code));
      } else {
        setSelectedCountries([...selectedCountries, country]);
      }
    },
    [setSelectedCountries, selectedCountries]
  );

  return (
    <WhiteView style={{ flex: 1 }}>
      <WhiteFullPageScrollView>
        {allCountries?.map((country: AllCountries) => (
          <ListLinkWithCheckbox
            key={country.code}
            text={country.name}
            showArrow={false}
            onSelect={async (selected) => onPress(country, selected)}
            navMethod={undefined}
            customOnPress={() => {}}
            selected={selectedCountries.some(cou => cou.code == country.code)}
          />
        ))}
      </WhiteFullPageScrollView>
      <GenericButton
        disabled={false}
        title="Next"
        onPress={()=>{ navigation.navigate('HolidayDetail', {countrycodes: selectedCountries.map(country => country.code)}) }}
        style={styles.nextButton}
        textStyle={{ color: whiteColor }}
      />
    </WhiteView>
  );
}

const stylesFun = function () {
  return StyleSheet.create({
    nextButton: {
      backgroundColor: useThemeColor({}, 'buttonDefault'),
      height: 58,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 60
    }
  });
};

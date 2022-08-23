import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetAllCountriesQuery } from 'reduxStore/services/api/holidays';
import { Country } from 'reduxStore/services/api/types';
import GenericButton from 'components/molecules/GenericButton';
import { useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { HolidayResponseType } from 'types/entities';
import { FullPageSpinner } from 'components/molecules/Spinners';

export default function HolidayListScreen({
  navigation
}: NativeStackScreenProps<any>) {
  const styles = StyleSheet.create({
    nextButton: {
      backgroundColor: useThemeColor({}, 'buttonDefault'),
      height: 58,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 60
    }
  });
  const { data: userDetails } = useGetUserDetails();
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const {
    data: allCountries,
    isError,
    error
  } = useGetAllCountriesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const { data: allEntities } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });
  const selectedHolidays = (allEntities &&
    Object.values(allEntities.byId).filter(
      (ent) => ent.resourcetype === 'Holiday'
    )) as HolidayResponseType[] | undefined;

  useEffect(() => {
    if (allCountries && selectedHolidays && selectedHolidays.length > 0) {
      setSelectedCountries(
        allCountries.filter((country) =>
          selectedHolidays
            .map((holiday) => holiday.country_code)
            .includes(country.code)
        )
      );
    }
  }, [allEntities, allCountries]);

  const whiteColor = useThemeColor({}, 'white');

  const onPress = useCallback(
    (country, selected) => {
      if (selectedCountries.some((cou) => cou.code == country.code)) {
        setSelectedCountries(
          selectedCountries.filter((cou) => cou.code != country.code)
        );
      } else {
        setSelectedCountries([...selectedCountries, country]);
      }
    },
    [selectedCountries]
  );

  if (!allCountries || !selectedHolidays) {
    return <FullPageSpinner/>
  }

  return (
    <WhiteView style={{ flex: 1 }}>
      <WhiteFullPageScrollView>
        {allCountries
          ?.filter((country) => ['AU', 'GB', 'US'].includes(country.code))
          .map((country: Country) => (
            <ListLinkWithCheckbox
              key={country.code}
              text={country.name}
              showArrow={false}
              onSelect={async (selected) => onPress(country, selected)}
              navMethod={undefined}
              customOnPress={() => {}}
              selected={selectedCountries.some(
                (cou) => cou.code == country.code
              )}
            />
          ))}
        {allCountries
          ?.filter((country) => !['AU', 'GB', 'US'].includes(country.code))
          .map((country: Country) => (
            <ListLinkWithCheckbox
              key={country.code}
              text={country.name}
              showArrow={false}
              onSelect={async (selected) => onPress(country, selected)}
              navMethod={undefined}
              customOnPress={() => {}}
              selected={selectedCountries.some(
                (cou) => cou.code == country.code
              )}
            />
          ))}
      </WhiteFullPageScrollView>
      <GenericButton
        disabled={false}
        title="Next"
        onPress={() => {
          navigation.navigate('HolidayDetail', {
            countrycodes: selectedCountries.map((country) => country.code)
          });
        }}
        style={styles.nextButton}
        textStyle={{ color: whiteColor }}
      />
    </WhiteView>
  );
}

import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { View } from 'components/Themed';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllCountriesQuery } from 'reduxStore/services/api/countries';
import { AllCountries } from 'reduxStore/services/api/types';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

export default function HolidayListScreen() {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allCountries,
    isError,
    error
  } = useGetAllCountriesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  return (
    <WhiteFullPageScrollView>
      {allCountries?.map((country: AllCountries) => (
        <AlmostBlackText text={country.name} />
      ))}
    </WhiteFullPageScrollView>
  );
}

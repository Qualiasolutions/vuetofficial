/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { WhitePaddedView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { useThemeColor, View } from 'components/Themed';
import { getUTCValuesFromDateString } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Image } from 'components/molecules/ImageComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { parsePresignedUrl } from 'utils/urls';
import { elevation } from 'styles/elevation';
import { selectEnforcedDate } from 'reduxStore/slices/calendars/selectors';
import SafePressable from 'components/molecules/SafePressable';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  drawerPressable: {
    height: 60,
    width: 60,
    marginLeft: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  drawerImage: {
    height: '100%',
    width: '100%'
  },
  drawerNullImage: {
    height: 30,
    width: 30
  },
  drawerSpace: {
    width: '20%'
  },
  endSpace: {
    width: '20%'
  },
  monthPressable: { flexDirection: 'row', alignItems: 'center' },
  monthText: { fontWeight: 'bold', fontSize: 20, marginRight: 10 }
});

export default function MonthSelector({
  onValueChange,
  fullPage
}: {
  onValueChange: (date: Date) => void;
  fullPage: boolean;
}) {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const enforcedDate = useSelector(selectEnforcedDate);
  const navigation = useNavigation();
  const { data: userDetails } = useGetUserFullDetails();
  const whiteColor = useThemeColor({}, 'white');

  const now = dayjs(new Date());
  const { monthName, year } = enforcedDate
    ? getUTCValuesFromDateString(enforcedDate)
    : { monthName: now.format('MMM'), year: now.format('YYYY') };

  if (!userDetails) {
    return null;
  }

  const imageSource = userDetails.presigned_profile_image_url
    ? { uri: parsePresignedUrl(userDetails.presigned_profile_image_url) }
    : require('assets/images/icons/camera.png');

  return (
    <WhitePaddedView style={[styles.container, elevation.elevated]}>
      {fullPage ? (
        <SafePressable
          onPress={() => (navigation as any).openDrawer()}
          style={[
            styles.drawerPressable,
            elevation.elevated,
            {
              backgroundColor: whiteColor
            }
          ]}
        >
          <Image
            source={imageSource}
            style={[
              !userDetails.presigned_profile_image_url
                ? styles.drawerNullImage
                : styles.drawerImage,
              {
                backgroundColor: whiteColor
              }
            ]}
          />
        </SafePressable>
      ) : (
        <View style={styles.drawerSpace} />
      )}
      <SafePressable
        onPress={() => {
          setIsDatePickerVisible(true);
        }}
        style={styles.monthPressable}
      >
        <AlmostBlackText
          text={`${monthName} ${year}`}
          style={styles.monthText}
        />
        <AlmostBlackText text="▼" />
      </SafePressable>
      <View style={styles.endSpace} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'date'}
        date={enforcedDate ? new Date(enforcedDate) : undefined}
        onConfirm={(newValue) => {
          setIsDatePickerVisible(false);
          onValueChange(newValue);
        }}
        onCancel={() => {
          setIsDatePickerVisible(false);
        }}
      />
    </WhitePaddedView>
  );
}

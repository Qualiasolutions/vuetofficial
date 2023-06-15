import React from 'react';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import {
  AlmostBlackText,
  BlackText
} from 'components/molecules/TextComponents';
import { EntityResponseType } from 'types/entities';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import { getLongDateFromDateObject } from 'utils/datesAndTimes';
import SafePressable from 'components/molecules/SafePressable';

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 5
  },
  listEntryText: {
    fontSize: 20
  }
});

export default function ModeOfAccommodationCard({
  entity
}: {
  entity: EntityResponseType;
}) {
  const navigation = useNavigation();
  const blackColor = useThemeColor({}, 'black');

  const startDateString = getLongDateFromDateObject(
    new Date(entity?.start_datetime),
    false
  );
  const endDateString = getLongDateFromDateObject(
    new Date(entity?.end_datetime),
    false
  );

  return (
    <SafePressable
      onPress={() => {
        (navigation as any).push('EditEntity', { entityId: entity.id });
      }}
    >
      <WhiteView style={[styles.listEntry, { borderColor: blackColor }]}>
        <BlackText text={`${entity.name}`} style={styles.listEntryText} />
        <AlmostBlackText text={`${startDateString} -> ${endDateString}`} />
      </WhiteView>
    </SafePressable>
  );
}

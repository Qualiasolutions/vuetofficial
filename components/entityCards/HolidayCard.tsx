import {
  AlmostBlackText,
  LightBlackText
} from 'components/molecules/TextComponents';
import { WhiteBox } from 'components/molecules/ViewComponents';
import { Pressable, StyleSheet } from 'react-native';
import {
  getDateWithoutTimezone,
  getDaysToAge,
  getLongDateFromDateObject
} from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import { EntityResponseType } from 'types/entities';

export default function HolidayCard({
  entity
}: {
  entity: EntityResponseType;
}) {
  const styles = StyleSheet.create({
    card: {
      marginTop: 10,
      alignItems: 'center',
      borderColor: useThemeColor({}, 'almostBlack')
    },
    listEntryText: {
      fontSize: 20
    }
  });

  const navigation = useNavigation();

  const startDateString = getLongDateFromDateObject(
    getDateWithoutTimezone(entity?.start_date)
  );
  const endDateString = getLongDateFromDateObject(
    getDateWithoutTimezone(entity?.end_date)
  );

  return (
    <Pressable
      onPress={() => {
        (navigation as any).push('EntityScreen', { entityId: entity.id });
      }}
    >
      <WhiteBox style={styles.card}>
        <LightBlackText text={entity.name || ''} style={styles.listEntryText} />
        <AlmostBlackText
          style={{ fontSize: 18 }}
          text={`${startDateString}${
            entity.end_date !== entity.start_date ? ` to ${endDateString}` : ''
          }`}
        />
      </WhiteBox>
    </Pressable>
  );
}

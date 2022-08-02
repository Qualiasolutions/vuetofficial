import {
  AlmostBlackText,
  LightBlackText
} from 'components/molecules/TextComponents';
import { WhiteBox } from 'components/molecules/ViewComponents';
import { Pressable, StyleSheet } from 'react-native';
import { getDateWithoutTimezone, getDaysToAge } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import { EntityResponseType } from 'types/entities';

export default function AnniversaryCard({
  entity
}: {
  entity: EntityResponseType;
}) {
  const styles = (function () {
    return StyleSheet.create({
      card: {
        height: 72,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: useThemeColor({}, 'almostBlack')
      },
      listEntryText: {
        fontSize: 20
      },
      divider: {
        height: 45,
        width: 0.5,
        marginRight: 24,
        marginLeft: 17.5
      }
    });
  })();

  const startDate = getDateWithoutTimezone(entity?.start_date);
  const { age, monthName, date } = getDaysToAge(startDate);
  const navigation = useNavigation();

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
          text={`${age} on ${monthName} ${date}`}
        />
      </WhiteBox>
    </Pressable>
  );
}

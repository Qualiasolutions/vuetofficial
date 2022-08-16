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
  
  export default function DaysOffCard({
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
  
    const startDate = getDateWithoutTimezone(entity?.start_date);
    const endDate = getDateWithoutTimezone(entity?.end_date);
  
    const { date: startdate, monthName, year } = getDaysToAge(startDate);
    const { date: enddate } = getDaysToAge(endDate);
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
            text={`${monthName} ${startdate} - ${enddate}, ${year}`}
          />
        </WhiteBox>
      </Pressable>
    );
  }
  
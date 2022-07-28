import {
  AlmostBlackText,
  LightBlackText,
  PrimaryText
} from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import Colors from '../../constants/Colors';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { getDateWithoutTimezone, getDaysToAge } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import { EntityResponseType } from 'types/entities';

export default function AnniversaryCard ({
  entity
}: {
  entity: EntityResponseType;
}) {
  const startDate = getDateWithoutTimezone(entity?.start_date);
  const { age, days, monthName, date } = getDaysToAge(startDate);
  const whiteColor = useThemeColor({}, 'white');
  const almostBlackColor = useThemeColor({}, 'almostBlack');
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        (navigation as any).push('EntityScreen', { entityId: entity.id });
      }}
      style={[styles.card, {backgroundColor: whiteColor}]}
    >
      <TransparentView style={{ flex: 1 }}>
        <LightBlackText text={entity.name || ''} style={styles.listEntryText} />
        <AlmostBlackText
          style={{ fontSize: 15 }}
          text={`Turns ${age} on ${monthName} ${date}`}
        />
      </TransparentView>

      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.divider, { backgroundColor: almostBlackColor }]} />
        <PrimaryText text={`${days}\ndays`} style={{ textAlign: 'center' }} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    marginHorizontal: 13,
    padding: 13,
    marginTop: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listEntryText: {
    fontSize: 18
  },
  divider: {
    height: 45,
    width: 0.5,
    marginRight: 24,
    marginLeft: 17.5
  }
});

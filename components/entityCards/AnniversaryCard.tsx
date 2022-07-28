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

type ListLinkProps = {
  text: string;
  toScreen: any;
  toScreenParams?: object;
  navMethod?: 'push' | 'navigate';
  style?: ViewStyle;
};

export const AnniversaryCard = ({
  text,
  toScreen,
  navMethod = 'navigate',
  toScreenParams = {},
  style = {}
}: ListLinkProps) => {
  const { entityId } = toScreenParams;
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const entity = allEntities?.byId[entityId];
  const startDate = getDateWithoutTimezone(entity?.start_date);

  const { age, days, monthName, date } = getDaysToAge(startDate);
  const whiteColor = useThemeColor({}, 'white');
  const almostBlackColor = useThemeColor({}, 'almostBlack');
  const greenColor = useThemeColor({}, 'green');

  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (navMethod === 'push') {
          (navigation as any).push(toScreen, toScreenParams);
        } else {
          (navigation.navigate as any)(toScreen, toScreenParams);
        }
      }}
      style={styles.card(whiteColor)}
    >
      <TransparentView style={{ flex: 1 }}>
        <LightBlackText text={text} style={styles.listEntryText} />
        <AlmostBlackText
          style={{ fontSize: 15 }}
          text={`Turns ${age} on ${monthName} ${date}`}
        />
      </TransparentView>

      <View style={styles.greenDot(greenColor)} />

      <View style={{ flexDirection: 'row' }}>
        <View style={styles.divider(almostBlackColor)} />
        <PrimaryText text={`${days}\ndays`} style={{ textAlign: 'center' }} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: (color) => ({
    backgroundColor: color,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    marginHorizontal: 13,
    padding: 13,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }),
  listEntryText: {
    fontSize: 18
  },
  divider: (color) => ({
    backgroundColor: color,
    height: 45,
    width: 0.5,
    marginRight: 24,
    marginLeft: 17.5
  }),
  greenDot: (color) => ({
    backgroundColor: color,
    height: 15,
    width: 15,
    borderRadius: 15 / 2
  })
});

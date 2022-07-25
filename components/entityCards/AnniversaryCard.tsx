import {
  AlmostBlackText,
  LightBlack,
  PrimaryText
} from 'components/molecules/TextComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import Colors from '../../constants/Colors';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import Helper from 'utils/Helper';
import { getDateWithoutTimezone } from 'utils/datesAndTimes';

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
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const entity = allEntities?.byId[entityId];
  const startDate = getDateWithoutTimezone(entity?.start_date);

  const { age, days, monthName, date } = Helper.getDaysToAge(startDate);

  return (
    <WhiteView style={styles.card}>
      <TransparentView style={{flex:1}}>
        <LightBlack text={text} style={styles.listEntryText} />
        <AlmostBlackText
          style={{ fontSize: 15 }}
          text={`Turns ${age} on ${monthName} ${date}`}
        />
      </TransparentView>

      <View style={styles.greenDot} />

      <View style={{ flexDirection: 'row' }}>
        <View style={styles.divider} />
        <PrimaryText text={`${days}\ndays`} style={{ textAlign: 'center' }} />
      </View>
    </WhiteView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 2, width: 2 },
    marginHorizontal: 13,
    padding: 13,
    marginTop: 10,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between'
  },
  listEntryText: {
    fontSize: 18
  },
  divider: {
    backgroundColor: Colors.light.almostBlack,
    height: 45,
    width: 0.5,
    marginRight: 24,
    marginLeft: 17.5
  },
 greenDot: {
    backgroundColor: Colors.light.green,
    height: 15,
    width: 15,
    borderRadius: 15/2
 } 
});

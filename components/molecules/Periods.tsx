import React from 'react';
import { Text, useThemeColor } from 'components/Themed';
import { Pressable, SectionList, StyleSheet } from 'react-native';
import { BlackText, PrimaryText } from './TextComponents';
import { TransparentView, WhiteView } from './ViewComponents';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetAllPeriodsQuery } from 'reduxStore/services/api/period';
import { FullPageSpinner } from './Spinners';

type PeriodsProps = {
  periods: {
    title: string;
    key: string;
    data: {
      title: string,
      message: string,
      key: number
    }[];
  }[]
}
export default function Periods({ periods }: PeriodsProps) {
  const navigation = useNavigation()
  const { data: allPeriods } = useGetAllPeriodsQuery("");
  const styles = style();

  if (!allPeriods) {
    return <FullPageSpinner/>
  }

  return (
    <WhiteView style={{ height: '100%' }}>
      <SectionList
        sections={periods}
        renderSectionHeader={({ section }) => (
          <TransparentView style={styles.sectionHeader}>
            <Text>{section.title}</Text>
          </TransparentView>
        )}
        renderItem={({ item }) => (
          <Pressable style={styles.sectionItem} onPress={() => {
            (navigation.navigate as any)('EntityNavigator', {
              screen: 'EntityScreen',
              initial: false,
              params: { entityId: allPeriods.byId[item.key].entity }
            })}
          }>
            <TransparentView style={styles.calendarContainer}>
              <Feather name="calendar" color={'#fff'} size={15} />
            </TransparentView>

            <TransparentView>
              <PrimaryText text={item.title} />
              <BlackText text={item.message} />
            </TransparentView>
          </Pressable>
        )}
        ItemSeparatorComponent={() => (
          <TransparentView style={styles.divider} />
        )}
        contentContainerStyle={{ paddingBottom: 400 }}
      />
    </WhiteView>
  );
}

function style() {
  return StyleSheet.create({
    sectionHeader: {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      height: 45,
      justifyContent: 'center',
      paddingLeft: 18
    },
    divider: {
      height: 1,
      backgroundColor: useThemeColor({}, 'almostWhite')
    },
    sectionItem: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      flexDirection: 'row'
    },
    calendarContainer: {
      backgroundColor: useThemeColor({}, 'primary'),
      height: 27,
      width: 27,
      borderRadius: 27 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 13
    }
  });
}

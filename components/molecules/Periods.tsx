import React from 'react';
import { Text, useThemeColor } from 'components/Themed';
import { SectionList, StyleSheet } from 'react-native';
import { BlackText, PrimaryText } from './TextComponents';
import { TransparentView, WhiteView } from './ViewComponents';
import { Feather } from '@expo/vector-icons';

export default function Periods({ periods }: any) {
  const styles = style();

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
          <TransparentView style={styles.sectionItem}>
            <TransparentView style={styles.calendarContainer}>
              <Feather name="calendar" color={'#fff'} size={15} />
            </TransparentView>

            <TransparentView>
              <PrimaryText text={item.title} />
              <BlackText text={item.message} />
            </TransparentView>
          </TransparentView>
        )}
        ItemSeparatorComponent={() => (
          <TransparentView style={styles.divider} />
        )}
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

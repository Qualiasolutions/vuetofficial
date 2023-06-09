import { StyleSheet } from 'react-native';
import { Text } from 'components/Themed';
import React from 'react';

import { TransparentView } from 'components/molecules/ViewComponents';

import { ITEM_HEIGHT } from './shared';
import { useSelector } from 'react-redux';
import { selectRoutineById } from 'reduxStore/slices/routines/selectors';
import SafePressable from 'components/molecules/SafePressable';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  leftInfo: {
    width: '20%',
    marginRight: 5
  },
  outerContainer: {
    borderBottomWidth: 1,
    paddingVertical: 5
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  routineName: { fontSize: 20 }
});

type PropTypes = {
  id: number;
  date: string;
};

export default function Routine({ id, date }: PropTypes) {
  const routine = useSelector(selectRoutineById(id));
  const navigation = useNavigation();
  if (!routine) {
    return (
      <TransparentView
        style={[styles.outerContainer, { height: ITEM_HEIGHT }]}
      />
    );
  }
  return (
    <TransparentView style={[styles.outerContainer, { height: ITEM_HEIGHT }]}>
      <SafePressable
        onPress={() => {
          (navigation.navigate as any)('RoutineTasks', {
            id,
            date
          });
        }}
        style={styles.container}
      >
        <TransparentView style={styles.leftInfo}>
          <Text>{routine.start_time.slice(0, 5)}</Text>
          <Text>{routine.end_time.slice(0, 5)}</Text>
        </TransparentView>
        <Text style={styles.routineName}>{routine.name}</Text>
      </SafePressable>
    </TransparentView>
  );
}

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import {
  AlmostBlackText,
  BlackText
} from 'components/molecules/TextComponents';
import { EntityResponseType } from 'types/entities';
import { useNavigation } from '@react-navigation/native';
import { useThemeColor } from 'components/Themed';
import SafePressable from 'components/molecules/SafePressable';

export default function ModeOfTransportCard({
  entity
}: {
  entity: EntityResponseType;
}) {
  const navigation = useNavigation();
  const blackColor = useThemeColor({}, 'black');

  return (
    <SafePressable
      onPress={() => {
        (navigation as any).push('EditEntity', { entityId: entity.id });
      }}
    >
      <WhiteView style={[styles.listEntry, { borderColor: blackColor }]}>
        <BlackText text={`${entity.name}`} style={styles.listEntryText} />
        <AlmostBlackText
          text={`${entity.start_location} -> ${entity.end_location}`}
        />
      </WhiteView>
    </SafePressable>
  );
}

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

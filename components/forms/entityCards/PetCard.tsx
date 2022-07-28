import React from 'react';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { EntityResponseType } from 'types/entities';

export default function PetCard({ entity }: { entity: EntityResponseType }) {
  return (
    <WhiteView style={styles.listEntry}>
      <AlmostBlackText
        text={`${entity.type} ${entity.name}`}
        style={styles.listEntryText}
      />
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5
  },
  listEntryText: {
    fontSize: 20
  }
});

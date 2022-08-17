import React from 'react';
import { StyleSheet } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import { EntityResponseType } from 'types/entities';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';

export default function PetCard({ entity }: { entity: EntityResponseType }) {
  return (
    <WhiteView style={[styles.listEntry, {borderColor: useThemeColor({},'black')}]}>
      <Feather name="image" size={25} color="grey" />
      <BlackText text={`${entity.name}`} style={styles.listEntryText} />
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
  },
  listEntryText: {
    fontSize: 20,
    marginLeft: 15
  }
});

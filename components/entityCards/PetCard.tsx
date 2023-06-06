import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { WhiteView } from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import { EntityResponseType } from 'types/entities';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';
import { useNavigation } from '@react-navigation/native';

export default function PetCard({ entity }: { entity: EntityResponseType }) {
  const blackColor = useThemeColor({}, 'black');
  const greyColor = useThemeColor({}, 'grey');
  const navigation = useNavigation();
  return (
    <SafePressable
      onPress={() => {
        (navigation as any).push('EditEntity', { entityId: entity.id });
      }}
    >
      <WhiteView style={[styles.listEntry, { borderColor: blackColor }]}>
        <Feather name="image" size={25} color={greyColor} />
        <BlackText text={`${entity.name}`} style={styles.listEntryText} />
      </WhiteView>
    </SafePressable>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1
  },
  listEntryText: {
    fontSize: 20,
    marginLeft: 15
  }
});

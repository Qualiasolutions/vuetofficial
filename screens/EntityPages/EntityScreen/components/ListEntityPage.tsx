import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import {
  TransparentContainerView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { TextInput } from 'components/Themed';
import {
  useCreateListEntryMutation,
  useDeleteListEntryMutation,
  useUpdateListEntryMutation
} from 'reduxStore/services/api/lists';
import { isListEntity } from 'types/entities';

export default function ListScreen({ entityId }: { entityId: number }) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });
  const entityData = allEntities?.byId[entityId];
  const { t } = useTranslation();
  const [newEntryTitle, setNewEntryTitle] = useState<string>('');
  const [createListEntry, createListEntryResult] = useCreateListEntryMutation();
  const [updateListEntry, updateListEntryResult] = useUpdateListEntryMutation();
  const [deleteListEntry, deleteListEntryResult] = useDeleteListEntryMutation();

  if (!isListEntity(entityData) || isLoading) {
    return null;
  }

  const listEntries = entityData.list_entries.map((listEntry) => (
    <WhiteBox style={styles.listEntry} key={listEntry.id}>
      <AlmostBlackText text={listEntry.title} />
      <Pressable onPress={() => deleteListEntry(listEntry.id)}>
        <Image
          source={require('../../../../assets/images/icons/remove-circle.png')}
        />
      </Pressable>
    </WhiteBox>
  ));

  return (
    <ScrollView>
      <TransparentContainerView>
        {listEntries}
        <TextInput
          value={newEntryTitle}
          onChangeText={(value) => setNewEntryTitle(value)}
          blurOnSubmit={false}
          onSubmitEditing={() =>
            createListEntry({
              list: entityData.id,
              title: newEntryTitle
            }).then(() => {
              setNewEntryTitle('');
            })
          }
          placeholder={t('screens.listEntity.typeOrUpload')}
        />
      </TransparentContainerView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  listEntryText: {}
});

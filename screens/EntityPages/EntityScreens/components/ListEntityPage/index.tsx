import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import {
  TransparentContainerView,
  TransparentView,
  WhiteBox,
  WhiteContainerView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import {
  useGetAllEntitiesQuery,
  useUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { TextInput } from 'components/Themed';
import {
  useCreateListEntryMutation,
  useDeleteListEntryMutation
} from 'reduxStore/services/api/lists';
import { isListEntity } from 'types/entities';
import { userService } from 'utils/userService';
import { UserResponse } from 'types/users';
import MemberList from 'components/molecules/MemberList';
import ListEntry from './components/ListEntry';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { Button } from 'components/molecules/ButtonComponents';

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
  const { data: userFullDetails } = useGetUserFullDetailsQuery(
    userDetails?.user_id || -1,
    {
      refetchOnMountOrArgChange: true,
      skip: !userDetails?.user_id
    }
  );

  const entityData = allEntities?.byId[entityId];
  const { t } = useTranslation();
  const [newEntryTitle, setNewEntryTitle] = useState<string>('');
  const [createListEntry, createListEntryResult] = useCreateListEntryMutation();
  const [deleteListEntry, deleteListEntryResult] = useDeleteListEntryMutation();

  const [updateEntity, updateEntityResult] = useUpdateEntityMutation();

  if (!isListEntity(entityData) || isLoading) {
    return null;
  }

  const memberIds = Array(
    ...new Set([...entityData.members, entityData.owner])
  );
  const members: UserResponse[] = [];

  if (userFullDetails) {
    memberIds.forEach((id: number) => {
      members.push(
        userService.getUserByIdFromUserFullDetails(id, userFullDetails)!
      );
    });
  }

  const onMemberListUpdate = (members: UserResponse[]) => {
    const memberIds = members.map((x) => x.id);
    updateEntity({
      id: entityId,
      resourcetype: entityData.resourcetype,
      members: memberIds
    })
      .unwrap()
      .then((res: any) => console.log(res)); //this won't work if there are no members assigned to the entity!!!!
  };

  const sortedListEntries = entityData.list_entries
    .slice()
    .sort((a, b) => a.id - b.id);

  const listEntryComponents = sortedListEntries.map((listEntry) => (
    <ListEntry listEntry={listEntry} key={listEntry.id}></ListEntry>
  ));

  const createEntry = () => {
    createListEntry({
      list: entityData.id,
      title: newEntryTitle
    });
    setNewEntryTitle('');
  };

  return (
    <WhiteFullPageScrollView>
      <WhiteView>
        {/* <MemberList
          userFullDetails={userFullDetails!}
          members={members}
          onChange={(members: UserResponse[]) => onMemberListUpdate(members)}
        /> */}
        {listEntryComponents}
        <TransparentView style={styles.newItemInputWrapper}>
          <TextInput
            value={newEntryTitle}
            onChangeText={(value) => setNewEntryTitle(value)}
            blurOnSubmit={false}
            onSubmitEditing={createEntry}
            placeholder={t('screens.listEntity.typeOrUpload')}
            style={styles.newItemInput}
          />
          <Button
            title={t('common.add')}
            onPress={createEntry}
            style={styles.submitButton}
          />
        </TransparentView>
      </WhiteView>
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  listEntryText: {},
  newItemInputWrapper: {
    padding: 10,
    marginBottom: 100,
    height: 75,
    flexDirection: 'row',
    width: '100%'
  },
  newItemInput: {
    height: '100%',
    flexGrow: 1,
    width: '50%'
  },
  submitButton: {
    height: '100%',
    marginLeft: 10,
    width: 130
  }
});

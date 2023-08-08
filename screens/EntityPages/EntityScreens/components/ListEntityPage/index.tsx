import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { useUpdateEntityMutation } from 'reduxStore/services/api/entities';

import { TextInput } from 'components/Themed';
import {
  useCreateListEntryMutation,
  useDeleteListEntryMutation,
  useFormCreateListEntryMutation
} from 'reduxStore/services/api/lists';
import { isListEntity } from 'types/entities';
import { userService } from 'utils/userService';
import { UserResponse } from 'types/users';
import MemberList from 'components/molecules/MemberList';
import ListEntry from './components/ListEntry';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { Button } from 'components/molecules/ButtonComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useSelector } from 'react-redux';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import {
  ImagePicker,
  PickedFile,
  SmallImagePicker
} from 'components/forms/components/ImagePicker';

const styles = StyleSheet.create({
  listEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  listEntryText: {},
  newItemInputWrapper: {
    flexDirection: 'row',
    height: 40,
    marginVertical: 10
  },
  newItemInput: {
    height: '100%',
    flexGrow: 1,
    width: '50%'
  },
  submitButton: {
    height: '100%',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 0,
    justifyContent: 'center'
  },
  bottomActions: {
    alignItems: 'flex-end',
    marginBottom: 100
  }
});

export default function ListEntityPage({ entityId }: { entityId: number }) {
  const { data: userFullDetails } = useGetUserFullDetails();
  const entityData = useSelector(selectEntityById(entityId));
  const { t } = useTranslation();
  const [newEntryTitle, setNewEntryTitle] = useState<string>('');
  const [createListEntry, createListEntryResult] = useCreateListEntryMutation();
  const [formCreateListEntry, formCreateListEntryResult] =
    useFormCreateListEntryMutation();
  const [deleteListEntry, deleteListEntryResult] = useDeleteListEntryMutation();

  const [updateEntity, updateEntityResult] = useUpdateEntityMutation();

  if (!isListEntity(entityData)) {
    return null;
  }

  const memberIds: number[] = Array(...new Set(entityData.members));
  const members: UserResponse[] = [];

  if (userFullDetails) {
    memberIds.forEach((id: number) => {
      members.push(
        userService.getUserByIdFromUserFullDetails(id, userFullDetails)!
      );
    });
  }

  const onMemberListUpdate = (mbrs: UserResponse[]) => {
    const mbrIds = mbrs.map((x) => x.id);
    updateEntity({
      id: entityId,
      resourcetype: entityData.resourcetype,
      members: mbrIds
    })
      .unwrap()
      .then((res: any) => console.log(res)); //this won't work if there are no members assigned to the entity!!!!
  };

  const sortedListEntries = entityData.list_entries
    .slice()
    .sort((a, b) => a.id - b.id);

  const listEntryComponents = sortedListEntries.map((listEntry) => (
    <ListEntry listEntry={listEntry} key={listEntry.id} />
  ));

  const createEntry = () => {
    createListEntry({
      list: entityData.id,
      title: newEntryTitle
    });
    setNewEntryTitle('');
  };

  const createImageEntry = (image: PickedFile) => {
    const data = new FormData();
    data.append('image', image as any);
    data.append('list', `${entityData.id}`);
    formCreateListEntry({ formData: data });
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
        <TransparentPaddedView style={styles.bottomActions}>
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
          <TransparentView style={styles.newItemInputWrapper}>
            <ImagePicker
              onImageSelect={(image: PickedFile) => {
                createImageEntry(image);
              }}
              backgroundColor="transparent"
              PressableComponent={({ onPress }: { onPress: () => void }) => (
                <Button
                  title="Add Image"
                  onPress={onPress}
                  style={styles.submitButton}
                />
              )}
              modalOffsets={{
                top: 30,
                left: -50
              }}
            />
          </TransparentView>
        </TransparentPaddedView>
      </WhiteView>
    </WhiteFullPageScrollView>
  );
}

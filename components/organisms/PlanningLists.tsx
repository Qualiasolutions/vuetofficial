import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import {
  useCreatePlanningListItemMutation,
  useCreatePlanningListMutation,
  useCreatePlanningSublistMutation,
  useDeletePlanningListItemMutation,
  useDeletePlanningListMutation,
  useDeletePlanningSublistMutation,
  useGetAllPlanningListItemsQuery,
  useGetAllPlanningListsQuery,
  useGetAllPlanningSublistsQuery,
  useUpdatePlanningListMutation
} from 'reduxStore/services/api/lists';
import { StyleSheet } from 'react-native';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { Button } from 'components/molecules/ButtonComponents';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { PlanningList, PlanningSublist } from 'types/lists';
import SafePressable from 'components/molecules/SafePressable';
import { Feather } from '@expo/vector-icons';
import { Modal, YesNoModal } from 'components/molecules/Modals';
import UserTags from 'components/molecules/UserTags';
import MemberSelector from 'components/forms/components/MemberSelector';

const addListStyles = StyleSheet.create({
  listInputPair: { flexDirection: 'row', width: '100%', alignItems: 'center' },
  input: { flex: 1, marginRight: 10, marginVertical: 5 },
  buttonWrapper: { alignItems: 'flex-start' },
  button: { paddingVertical: 5 }
});

const AddList = ({ category }: { category: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();
  const [createNewPlanningList] = useCreatePlanningListMutation();

  if (isLoadingUserDetails || !userDetails) {
    return null;
  }

  return (
    <TransparentView>
      <TransparentView style={addListStyles.listInputPair}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addListStyles.input}
        />
        <TransparentView style={addListStyles.buttonWrapper}>
          <Button
            style={addListStyles.button}
            disabled={!newName}
            title={t('components.planningLists.addList')}
            onPress={async () => {
              try {
                setNewName('');
                await createNewPlanningList({
                  category,
                  name: newName,
                  members: [userDetails.id]
                }).unwrap();
              } catch (err) {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
          />
        </TransparentView>
      </TransparentView>
    </TransparentView>
  );
};

const AddSublist = ({ list }: { list: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [createPlanningSublist] = useCreatePlanningSublistMutation();

  return (
    <TransparentView>
      <TransparentView style={addListStyles.listInputPair}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addListStyles.input}
        />
        <TransparentView style={addListStyles.buttonWrapper}>
          <Button
            style={addListStyles.button}
            disabled={!newName}
            title={t('components.planningLists.addSublist')}
            onPress={async () => {
              try {
                setNewName('');
                await createPlanningSublist({
                  list,
                  title: newName
                }).unwrap();
              } catch (err) {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
          />
        </TransparentView>
      </TransparentView>
    </TransparentView>
  );
};

const addListItemStyles = StyleSheet.create({
  listInputPair: { flexDirection: 'row', alignItems: 'center' },
  input: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 'auto',
    borderWidth: 0,
    borderBottomWidth: 1,
    width: 150
  }
});
const AddListItem = ({ sublist }: { sublist: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [createPlanningListItem] = useCreatePlanningListItemMutation();

  return (
    <TransparentView>
      <TransparentView style={addListItemStyles.listInputPair}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addListItemStyles.input}
        />
        <TransparentView style={addListStyles.buttonWrapper}>
          <SafePressable
            onPress={async () => {
              try {
                setNewName('');
                await createPlanningListItem({
                  sublist,
                  title: newName
                }).unwrap();
              } catch (err) {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
          >
            <Feather name="plus" size={24} color="green" />
          </SafePressable>
        </TransparentView>
      </TransparentView>
    </TransparentView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  categoryHeader: { fontSize: 22 },
  listHeader: { fontSize: 18, marginRight: 10 },
  listHeaderSection: { flexDirection: 'row', alignItems: 'center' },
  sublistHeader: { fontSize: 16, marginRight: 10 },
  listBox: { marginBottom: 20 },
  sublistView: { marginBottom: 20, paddingLeft: 20 },
  listItemView: { paddingLeft: 20, flexDirection: 'row', alignItems: 'center' },
  listItemTitle: { marginRight: 10 },
  saveMembersButton: {
    marginTop: 20
  }
});

const PlanningSublistView = ({ sublist }: { sublist: PlanningSublist }) => {
  const { data: allListItems, isLoading: isLoadingListItems } =
    useGetAllPlanningListItemsQuery();

  const [deleteSublist] = useDeletePlanningSublistMutation();
  const [deleting, setDeleting] = useState(false);

  const [deleteListItem] = useDeletePlanningListItemMutation();

  const { t } = useTranslation();

  const isLoading = isLoadingListItems || !allListItems;

  if (isLoading) {
    return null;
  }

  const sublistItems = allListItems.bySublist[sublist.id] || [];

  return (
    <TransparentView style={styles.sublistView}>
      <TransparentView style={styles.listHeaderSection}>
        <Text style={styles.sublistHeader}>{sublist.title}</Text>
        <SafePressable
          onPress={() => {
            setDeleting(true);
          }}
        >
          <Feather name="trash" size={16} color="red" />
        </SafePressable>
      </TransparentView>
      {sublistItems.map((itemId) => {
        const item = allListItems.byId[itemId];
        return (
          <TransparentView key={itemId} style={styles.listItemView}>
            <Text style={styles.listItemTitle}>{item.title}</Text>
            <SafePressable onPress={() => deleteListItem(itemId)}>
              <Feather name="minus" color="red" size={20} />
            </SafePressable>
          </TransparentView>
        );
      })}
      <TransparentView style={styles.listItemView}>
        <AddListItem sublist={sublist.id} />
      </TransparentView>
      <YesNoModal
        title={t('components.planningLists.deleteSublistModal.title')}
        question={t('components.planningLists.deleteSublistModal.blurb')}
        visible={deleting}
        onYes={() => {
          deleteSublist(sublist.id);
        }}
        onNo={() => {
          setDeleting(false);
        }}
        onRequestClose={() => {
          setDeleting(false);
        }}
      />
    </TransparentView>
  );
};

const PlanningListView = ({ list }: { list: PlanningList }) => {
  const { data: allSublists, isLoading: isLoadingSublists } =
    useGetAllPlanningSublistsQuery();

  const [deleteList] = useDeletePlanningListMutation();
  const [updateList, updateListResult] = useUpdatePlanningListMutation();
  const [deleting, setDeleting] = useState(false);
  const [editingMembers, setEditingMembers] = useState(false);
  const [newMembers, setNewMembers] = useState(list.members);
  const { t } = useTranslation();

  const isLoading = isLoadingSublists || !allSublists;

  if (isLoading) {
    return null;
  }

  const sublists = allSublists.byList[list.id] || [];

  return (
    <WhiteBox style={styles.listBox}>
      <TransparentView style={styles.listHeaderSection}>
        <Text style={styles.listHeader}>{list.name}</Text>
        <SafePressable
          onPress={() => {
            setDeleting(true);
          }}
        >
          <Feather name="trash" size={20} color="red" />
        </SafePressable>
      </TransparentView>
      {sublists.map((sublistId) => {
        const sublist = allSublists.byId[sublistId];
        return <PlanningSublistView sublist={sublist} key={sublistId} />;
      })}
      <AddSublist list={list.id} />
      <SafePressable
        onPress={() => {
          setEditingMembers(true);
        }}
      >
        <UserTags memberIds={list.members} />
      </SafePressable>
      <YesNoModal
        title={t('components.planningLists.deleteListModal.title')}
        question={t('components.planningLists.deleteListModal.blurb')}
        visible={deleting}
        onYes={() => {
          deleteList(list.id);
        }}
        onNo={() => {
          setDeleting(false);
        }}
        onRequestClose={() => {
          setDeleting(false);
        }}
      />
      <Modal
        visible={editingMembers}
        onRequestClose={() => {
          setEditingMembers(false);
        }}
      >
        <MemberSelector
          values={newMembers}
          onValueChange={(selectedMembers) => {
            setNewMembers(selectedMembers);
          }}
        />
        {updateListResult.isLoading ? (
          <PaddedSpinner />
        ) : (
          <Button
            onPress={async () => {
              await updateList({
                id: list.id,
                members: newMembers
              }).unwrap();
              setEditingMembers(false);
            }}
            title={t('common.save')}
            style={styles.saveMembersButton}
          />
        )}
      </Modal>
    </WhiteBox>
  );
};

export default function PlanningLists() {
  const { data: planningLists, isLoading: isLoadingPlanningLists } =
    useGetAllPlanningListsQuery();

  const { data: allCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();

  const { t } = useTranslation();

  const isLoading =
    isLoadingPlanningLists ||
    isLoadingCategories ||
    !planningLists ||
    !allCategories;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  const categoryViews = Object.values(allCategories.byId).map((category) => (
    <TransparentPaddedView key={category.id}>
      <Text style={styles.categoryHeader}>
        {t(`categories.${category.name}`)}
      </Text>
      {planningLists.byCategory[category.id] &&
        planningLists.byCategory[category.id].map((listId) => {
          const list = planningLists.byId[listId];
          return <PlanningListView list={list} key={listId} />;
        })}
      <AddList category={category.id} />
    </TransparentPaddedView>
  ));

  return (
    <WhiteFullPageScrollView contentContainerStyle={styles.container}>
      {categoryViews}
    </WhiteFullPageScrollView>
  );
}

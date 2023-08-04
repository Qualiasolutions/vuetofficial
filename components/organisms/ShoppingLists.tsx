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
  useCreateShoppingListItemMutation,
  useCreateShoppingListMutation,
  useCreateShoppingSublistMutation,
  useDeleteShoppingListItemMutation,
  useDeleteShoppingListMutation,
  useDeleteShoppingSublistMutation,
  useGetAllShoppingListItemsQuery,
  useGetAllShoppingListsQuery,
  useGetAllShoppingSublistsQuery,
  useUpdateShoppingListItemMutation,
  useUpdateShoppingListMutation
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
import Checkbox from 'components/molecules/Checkbox';

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
  const [createNewShoppingList] = useCreateShoppingListMutation();

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
            title={t('components.shoppingLists.addList')}
            onPress={async () => {
              try {
                setNewName('');
                await createNewShoppingList({
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
  const [createShoppingSublist] = useCreateShoppingSublistMutation();

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
            title={t('components.shoppingLists.addSublist')}
            onPress={async () => {
              try {
                setNewName('');
                await createShoppingSublist({
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
  const [createShoppingListItem] = useCreateShoppingListItemMutation();

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
                await createShoppingListItem({
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
  },
  checkbox: { width: 16, height: 16 }
});

const ShoppingSublistView = ({ sublist }: { sublist: PlanningSublist }) => {
  const { data: allListItems, isLoading: isLoadingListItems } =
    useGetAllShoppingListItemsQuery();

  const [deleteSublist] = useDeleteShoppingSublistMutation();

  const [deleting, setDeleting] = useState(false);

  const [deleteListItem] = useDeleteShoppingListItemMutation();
  const [updateListItem] = useUpdateShoppingListItemMutation();

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
            <Checkbox
              checked={item.checked}
              onValueChange={async () => {
                updateListItem({
                  id: item.id,
                  checked: !item.checked
                });
              }}
              style={styles.checkbox}
            />
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
        title={t('components.shoppingLists.deleteSublistModal.title')}
        question={t('components.shoppingLists.deleteSublistModal.blurb')}
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

const ShoppingListView = ({ list }: { list: PlanningList }) => {
  const { data: allSublists, isLoading: isLoadingSublists } =
    useGetAllShoppingSublistsQuery();

  const [deleteList] = useDeleteShoppingListMutation();
  const [updateList, updateListResult] = useUpdateShoppingListMutation();
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
        return <ShoppingSublistView sublist={sublist} key={sublistId} />;
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
        title={t('components.shoppingLists.deleteListModal.title')}
        question={t('components.shoppingLists.deleteListModal.blurb')}
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

export default function ShoppingLists() {
  const { data: shoppingLists, isLoading: isLoadingShoppingLists } =
    useGetAllShoppingListsQuery();

  const { data: allCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();

  const { t } = useTranslation();

  const isLoading =
    isLoadingShoppingLists ||
    isLoadingCategories ||
    !shoppingLists ||
    !allCategories;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  const categoryViews = Object.values(allCategories.byId).map((category) => (
    <TransparentPaddedView key={category.id}>
      <Text style={styles.categoryHeader}>
        {t(`categories.${category.name}`)}
      </Text>
      {shoppingLists.byCategory[category.id] &&
        shoppingLists.byCategory[category.id].map((listId) => {
          const list = shoppingLists.byId[listId];
          return <ShoppingListView list={list} key={listId} />;
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

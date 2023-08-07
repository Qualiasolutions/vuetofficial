import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import {
  useGetAllShoppingListsQuery,
  useGetAllShoppingSublistsQuery,
  useUpdateShoppingListMutation
} from 'reduxStore/services/api/lists';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Button } from 'components/molecules/ButtonComponents';
import { ShoppingList } from 'types/lists';
import SafePressable from 'components/molecules/SafePressable';
import { Modal } from 'components/molecules/Modals';
import UserTags from 'components/molecules/UserTags';
import MemberSelector from 'components/forms/components/MemberSelector';
import AddListButton from 'components/molecules/AddListButton';
import AddSublistInputPair from 'components/molecules/AddSublistInputPair';
import SublistView from 'components/molecules/SublistView';
import PlanningListHeader from 'components/molecules/PlanningListHeader';

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  categoryHeader: { fontSize: 22, marginRight: 20 },
  categoryHeaderSection: {
    marginBottom: 10,
    flexDirection: 'row'
  },
  listHeader: { fontSize: 18, marginRight: 10 },
  listHeaderSection: { flexDirection: 'row', alignItems: 'center' },
  listBox: { marginBottom: 20 },
  sublists: { paddingLeft: 10 },
  sublistView: { marginBottom: 20 },
  saveMembersButton: {
    marginTop: 20
  },
  addListButtonWrapper: { marginBottom: 10 }
});

const ShoppingListView = ({ list }: { list: ShoppingList }) => {
  const { data: allSublists, isLoading: isLoadingSublists } =
    useGetAllShoppingSublistsQuery();

  const [updateList, updateListResult] = useUpdateShoppingListMutation();
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
      <PlanningListHeader list={list} />
      <TransparentView style={styles.sublists}>
        {sublists.map((sublistId) => {
          const sublist = allSublists.byId[sublistId];
          return (
            <SublistView
              sublist={sublist}
              key={sublistId}
              style={styles.sublistView}
            />
          );
        })}
        <AddSublistInputPair list={list.id} />
      </TransparentView>
      <SafePressable
        onPress={() => {
          setEditingMembers(true);
        }}
      >
        <UserTags memberIds={list.members} />
      </SafePressable>
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

  const isLoading = isLoadingShoppingLists || !shoppingLists;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <WhiteFullPageScrollView contentContainerStyle={styles.container}>
      <TransparentPaddedView>
        <TransparentView style={styles.addListButtonWrapper}>
          <AddListButton isShoppingList={true} />
        </TransparentView>
        {shoppingLists.ids.map((listId) => {
          const list = shoppingLists.byId[listId];
          return <ShoppingListView list={list} key={listId} />;
        })}
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

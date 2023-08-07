import { TransparentView } from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import {
  useDeletePlanningListItemMutation,
  useDeletePlanningSublistMutation,
  useGetAllPlanningListItemsQuery,
  useGetAllPlanningListsQuery,
  useUpdatePlanningListItemMutation
} from 'reduxStore/services/api/lists';
import { StyleSheet, ViewStyle } from 'react-native';
import { useState } from 'react';
import { PlanningSublist } from 'types/lists';
import SafePressable from 'components/molecules/SafePressable';
import { Feather } from '@expo/vector-icons';
import { YesNoModal } from 'components/molecules/Modals';
import Checkbox from 'components/molecules/Checkbox';
import { useNavigation } from '@react-navigation/native';
import AddListItemInputPair from 'components/molecules/AddListItemInputPair';

const styles = StyleSheet.create({
  listHeader: { fontSize: 18, marginRight: 10 },
  listHeaderSection: { flexDirection: 'row', alignItems: 'center' },
  sublistHeader: { fontSize: 16, marginRight: 10 },
  listItemView: { paddingLeft: 10, flexDirection: 'row', alignItems: 'center' },
  listItemTitle: { marginRight: 10 },
  checkbox: { width: 16, height: 16 },
  listItemCalendarLink: { marginLeft: 10 }
});

export default function SublistView({
  sublist,
  style
}: {
  sublist: PlanningSublist;
  style?: ViewStyle;
}) {
  const { data: allListItems, isLoading: isLoadingListItems } =
    useGetAllPlanningListItemsQuery();

  const { data: allLists, isLoading: isLoadingLists } =
    useGetAllPlanningListsQuery();

  const [deleteSublist] = useDeletePlanningSublistMutation();
  const [deleting, setDeleting] = useState(false);

  const [deleteListItem] = useDeletePlanningListItemMutation();
  const [updateListItem] = useUpdatePlanningListItemMutation();

  const { t } = useTranslation();
  const navigation = useNavigation();

  const isLoading =
    isLoadingListItems || !allListItems || isLoadingLists || !allLists;

  if (isLoading) {
    return null;
  }

  const sublistItems = allListItems.bySublist[sublist.id] || [];
  const parentList = allLists.byId[sublist.list];

  return (
    <TransparentView style={style || {}}>
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
            <SafePressable
              onPress={() => {
                (navigation.navigate as any)('AddTask', {
                  type: 'TASK',
                  title: item.title,
                  members: parentList.members
                });
              }}
              style={styles.listItemCalendarLink}
            >
              <Feather name="calendar" size={16} color="green" />
            </SafePressable>
          </TransparentView>
        );
      })}
      <TransparentView style={styles.listItemView}>
        <AddListItemInputPair sublist={sublist.id} />
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
}

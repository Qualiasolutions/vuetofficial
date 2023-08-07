import { TransparentView } from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import {
  useDeletePlanningListItemMutation,
  useGetAllPlanningListItemsQuery,
  useGetAllPlanningListsQuery,
  useUpdatePlanningListItemMutation
} from 'reduxStore/services/api/lists';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { PlanningList, PlanningListItem } from 'types/lists';
import SafePressable from 'components/molecules/SafePressable';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'components/molecules/Checkbox';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  sublistHeader: {
    fontSize: 16,
    height: 28,
    paddingVertical: 0,
    paddingHorizontal: 5
  },
  listItemView: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemTitle: {
    paddingVertical: 0,
    paddingHorizontal: 5,
    flexShrink: 1
  },
  editTextInput: { height: 26 },
  checkbox: { width: 16, height: 16 },
  listItemCalendarLink: { marginLeft: 10 },
  actionButton: { marginLeft: 10 }
});

export default function ListItemView({
  item,
  parentList
}: {
  item: PlanningListItem;
  parentList: PlanningList;
}) {
  const { data: allListItems, isLoading: isLoadingListItems } =
    useGetAllPlanningListItemsQuery();

  const { data: allLists, isLoading: isLoadingLists } =
    useGetAllPlanningListsQuery();

  const [deleteListItem] = useDeletePlanningListItemMutation();
  const [updateListItem] = useUpdatePlanningListItemMutation();
  const navigation = useNavigation();

  const [editingName, setEditingName] = useState(false);
  const [newItemName, setNewItemName] = useState(item.title);

  const { t } = useTranslation();

  const isLoading =
    isLoadingListItems || !allListItems || isLoadingLists || !allLists;

  if (isLoading) {
    return null;
  }

  const content = editingName ? (
    <>
      <TextInput
        style={[styles.listItemTitle, styles.editTextInput]}
        value={newItemName}
        onChangeText={setNewItemName}
        autoFocus={true}
        onBlur={() => {
          setEditingName(false);
          setNewItemName(item.title);
        }}
      />
      <SafePressable
        onPress={() => {
          setEditingName(false);
        }}
        style={styles.actionButton}
      >
        <Feather name="x" size={20} color="red" />
      </SafePressable>
      <SafePressable
        onPress={async () => {
          try {
            setEditingName(false);
            await updateListItem({
              id: item.id,
              title: newItemName
            }).unwrap();
          } catch (err) {
            Toast.show({
              type: 'error',
              text1: t('common.errors.generic')
            });
          }
        }}
        style={styles.actionButton}
      >
        <Feather name="check" size={20} color="green" />
      </SafePressable>
    </>
  ) : (
    <>
      <SafePressable
        onPress={() => setEditingName(true)}
        style={styles.listItemTitle}
      >
        <Text>{item.title}</Text>
      </SafePressable>
      <SafePressable
        onPress={() => deleteListItem(item.id)}
        style={styles.actionButton}
      >
        <Feather name="minus" color="red" size={16} />
      </SafePressable>
      <SafePressable
        onPress={() => setEditingName(true)}
        style={styles.actionButton}
      >
        <Feather name="edit" color="orange" size={16} />
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
    </>
  );

  return (
    <TransparentView style={styles.listItemView}>
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
      {content}
    </TransparentView>
  );
}

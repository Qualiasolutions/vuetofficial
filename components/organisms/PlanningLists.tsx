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
  useCreatePlanningListTemplateMutation,
  useCreatePlanningSublistMutation,
  useDeletePlanningListItemMutation,
  useDeletePlanningListMutation,
  useDeletePlanningSublistMutation,
  useGetAllPlanningListItemsQuery,
  useGetAllPlanningListsQuery,
  useGetAllPlanningListTemplatesQuery,
  useGetAllPlanningSublistsQuery,
  useUpdatePlanningListItemMutation,
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
import Checkbox from 'components/molecules/Checkbox';
import { useNavigation } from '@react-navigation/native';
import DropDown from 'components/forms/components/DropDown';

const addListStyles = StyleSheet.create({
  listInputPair: { flexDirection: 'row', width: '100%', alignItems: 'center' },
  input: { marginVertical: 5, width: 150 },
  buttonWrapper: { alignItems: 'flex-start', flexDirection: 'row' },
  button: { paddingVertical: 5, marginHorizontal: 5 },
  selectTemplateDropdown: { marginBottom: 10 },
  selectTemplateButtonWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  createFromTemplateModalContent: {
    alignItems: 'center',
    width: 250,
    maxWidth: '100%'
  }
});

const AddList = ({ category }: { category: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [newListTemplateId, setNewListTemplateId] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [addingNewFromTemplate, setAddingNewFromTemplate] = useState(false);
  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();
  const [createNewPlanningList] = useCreatePlanningListMutation();
  const [createTemplate] = useCreatePlanningListTemplateMutation();

  const {
    data: planningListTemplates,
    isLoading: isLoadingPlanningListTemplates
  } = useGetAllPlanningListTemplatesQuery();

  const isLoading =
    isLoadingUserDetails ||
    !userDetails ||
    isLoadingPlanningListTemplates ||
    !planningListTemplates;

  if (isLoading) {
    return null;
  }

  return (
    <TransparentView>
      <TransparentView style={addListStyles.listInputPair}>
        <TransparentView style={addListStyles.buttonWrapper}>
          <Button
            style={addListStyles.button}
            title={t('components.planningLists.addList')}
            onPress={() => {
              setAddingNew(true);
            }}
          />
          <Button
            style={addListStyles.button}
            title={t('components.planningLists.addListFromTemplate')}
            onPress={async () => {
              setAddingNewFromTemplate(true);
            }}
          />
        </TransparentView>
      </TransparentView>
      <Modal
        visible={addingNew}
        onRequestClose={() => {
          setAddingNew(false);
        }}
      >
        <Text>
          {t('components.planningLists.createFromTemplateModal.blurb')}
        </Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addListStyles.input}
        />
        <Button
          style={addListStyles.button}
          title={t('components.planningLists.addListModal.add')}
          onPress={async () => {
            try {
              setAddingNew(false);
              await createNewPlanningList({
                category,
                name: newName,
                members: [userDetails.id]
              }).unwrap();
              setNewName('');
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }}
        />
      </Modal>
      <Modal
        visible={addingNewFromTemplate}
        onRequestClose={() => {
          setAddingNewFromTemplate(false);
        }}
      >
        <TransparentView style={addListStyles.createFromTemplateModalContent}>
          {planningListTemplates.ids.length > 0 ? (
            <>
              <DropDown
                value={newListTemplateId}
                items={planningListTemplates.ids.map((templateId) => {
                  const template = planningListTemplates.byId[templateId];
                  return {
                    value: templateId,
                    label: template.name
                  };
                })}
                setFormValues={setNewListTemplateId}
                listMode="MODAL"
                style={addListStyles.selectTemplateDropdown}
              />
              <Text>
                {t('components.planningLists.createFromTemplateModal.blurb')}
              </Text>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                style={addListStyles.input}
              />
            </>
          ) : (
            <Text>{t('components.planningLists.noTemplates')}</Text>
          )}
          <TransparentView style={addListStyles.selectTemplateButtonWrapper}>
            <Button
              title={t('common.ok')}
              disabled={!newListTemplateId || !newName}
              onPress={async () => {
                if (planningListTemplates.ids.length > 0) {
                  try {
                    setAddingNewFromTemplate(false);
                    await createTemplate({
                      title: newName,
                      list: parseInt(newListTemplateId),
                      from_template: true
                    });
                    setNewListTemplateId('');
                    setNewName('');
                  } catch (err) {
                    Toast.show({
                      type: 'error',
                      text1: t('common.errors.generic')
                    });
                  }
                } else {
                  setAddingNewFromTemplate(false);
                }
              }}
              style={addListStyles.button}
            />
          </TransparentView>
        </TransparentView>
      </Modal>
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
  categoryHeader: { fontSize: 22, marginRight: 20 },
  categoryHeaderSection: {
    marginBottom: 10
  },
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
  checkbox: { width: 16, height: 16 },
  listItemCalendarLink: { marginLeft: 10 },
  listTemplateLink: { marginLeft: 10 },
  saveTemplateButtonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  saveTemplateModalContent: {
    maxWidth: 250,
    alignItems: 'center'
  }
});

const PlanningSublistView = ({ sublist }: { sublist: PlanningSublist }) => {
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
  const [createTemplate] = useCreatePlanningListTemplateMutation();
  const [deleting, setDeleting] = useState(false);
  const [editingMembers, setEditingMembers] = useState(false);
  const [savingAsTemplate, setSavingAsTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

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
        <SafePressable
          onPress={() => {
            setSavingAsTemplate(true);
          }}
          style={styles.listTemplateLink}
        >
          <Feather name="save" size={20} color="green" />
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
      <Modal
        visible={savingAsTemplate}
        onRequestClose={() => setSavingAsTemplate(false)}
      >
        <TransparentView style={styles.saveTemplateModalContent}>
          <Text>{t('components.planningLists.saveTemplateModal.blurb')}</Text>
          <TextInput
            value={newTemplateName}
            onChangeText={setNewTemplateName}
            style={addListStyles.input}
          />
          <TransparentView style={styles.saveTemplateButtonWrapper}>
            <Button
              title={t('common.save')}
              onPress={async () => {
                try {
                  setSavingAsTemplate(false);
                  await createTemplate({
                    title: newTemplateName,
                    list: list.id
                  });
                  setNewTemplateName('');
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
      <TransparentView style={styles.categoryHeaderSection}>
        <Text style={styles.categoryHeader}>
          {t(`categories.${category.name}`)}
        </Text>
        <AddList category={category.id} />
      </TransparentView>
      {planningLists.byCategory[category.id] &&
        planningLists.byCategory[category.id].map((listId) => {
          const list = planningLists.byId[listId];
          return <PlanningListView list={list} key={listId} />;
        })}
    </TransparentPaddedView>
  ));

  return (
    <WhiteFullPageScrollView contentContainerStyle={styles.container}>
      {categoryViews}
    </WhiteFullPageScrollView>
  );
}

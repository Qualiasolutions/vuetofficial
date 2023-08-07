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
  useCreatePlanningListTemplateMutation,
  useDeletePlanningListMutation,
  useGetAllPlanningListsQuery,
  useGetAllPlanningSublistsQuery,
  useUpdatePlanningListMutation
} from 'reduxStore/services/api/lists';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Button } from 'components/molecules/ButtonComponents';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { PlanningList } from 'types/lists';
import SafePressable from 'components/molecules/SafePressable';
import { Feather } from '@expo/vector-icons';
import { Modal, YesNoModal } from 'components/molecules/Modals';
import UserTags from 'components/molecules/UserTags';
import MemberSelector from 'components/forms/components/MemberSelector';
import AddListButton from 'components/molecules/AddListButton';
import AddSublistInputPair from 'components/molecules/AddSublistInputPair';
import SublistView from 'components/molecules/SublistView';

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
  listTemplateLink: { marginLeft: 10 },
  saveTemplateButtonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  saveTemplateModalContent: {
    maxWidth: 250,
    alignItems: 'center'
  }
});

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
        <AddListButton category={category.id} />
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

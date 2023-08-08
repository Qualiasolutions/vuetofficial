import { TransparentView } from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import {
  useCreatePlanningListTemplateMutation,
  useDeletePlanningListMutation,
  useDeleteShoppingListMutation,
  useUpdatePlanningListMutation,
  useUpdateShoppingListMutation
} from 'reduxStore/services/api/lists';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { PlanningList, ShoppingList } from 'types/lists';
import SafePressable from 'components/molecules/SafePressable';
import { Feather } from '@expo/vector-icons';
import { Modal, YesNoModal } from './Modals';
import { Button } from './ButtonComponents';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const styles = StyleSheet.create({
  listHeader: {
    height: 40,
    textAlignVertical: 'center',
    textAlign: 'center',
    justifyContent: 'center'
  },
  listHeaderText: { fontSize: 18 },
  listHeaderSection: { flexDirection: 'row', alignItems: 'center' },
  sublists: { paddingLeft: 10 },
  listTemplateLink: { marginLeft: 10 },
  saveTemplateButtonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  saveTemplateModalContent: {
    maxWidth: 250,
    alignItems: 'center'
  }
});

export default function PlanningListHeader({
  list,
  isShoppingList
}: {
  list: PlanningList | ShoppingList;
  isShoppingList?: boolean;
}) {
  const [deleteList] = useDeletePlanningListMutation();
  const [deleteShoppingList] = useDeleteShoppingListMutation();
  const [createTemplate] = useCreatePlanningListTemplateMutation();
  const [updateList] = useUpdatePlanningListMutation();
  const [updateShoppingList] = useUpdateShoppingListMutation();
  const [deleting, setDeleting] = useState(false);
  const [savingAsTemplate, setSavingAsTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newListName, setNewListName] = useState(list.name);

  const { t } = useTranslation();

  if (editingName) {
    return (
      <TransparentView style={styles.listHeaderSection}>
        <TextInput
          style={[styles.listHeader, styles.listHeaderText]}
          value={newListName}
          onChangeText={setNewListName}
          autoFocus={true}
          onBlur={() => {
            // Set a timeout because otherwise the update is sometimes not processed
            setTimeout(() => {
              setEditingName(false);
              setNewListName(list.name);
            }, 100);
          }}
        />
        <SafePressable
          onPress={() => {
            setEditingName(false);
          }}
          style={styles.listTemplateLink}
        >
          <Feather name="x" size={20} color="red" />
        </SafePressable>
        <SafePressable
          onPress={async () => {
            try {
              setEditingName(false);
              if (isShoppingList) {
                await updateShoppingList({
                  id: list.id,
                  name: newListName
                }).unwrap();
              } else {
                await updateList({
                  id: list.id,
                  name: newListName
                }).unwrap();
              }
            } catch (err) {
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }}
          style={styles.listTemplateLink}
        >
          <Feather name="check" size={20} color="green" />
        </SafePressable>
      </TransparentView>
    );
  }

  return (
    <TransparentView style={styles.listHeaderSection}>
      <SafePressable
        onPress={() => {
          setEditingName(true);
        }}
        style={styles.listHeader}
      >
        <Text style={styles.listHeaderText}>{list.name}</Text>
      </SafePressable>
      <SafePressable
        onPress={() => {
          setDeleting(true);
        }}
        style={styles.listTemplateLink}
      >
        <Feather name="trash" size={20} color="red" />
      </SafePressable>
      <SafePressable
        onPress={() => {
          setEditingName(true);
        }}
        style={styles.listTemplateLink}
      >
        <Feather name="edit" size={20} color="orange" />
      </SafePressable>
      {!isShoppingList && (
        <SafePressable
          onPress={() => {
            setSavingAsTemplate(true);
          }}
          style={styles.listTemplateLink}
        >
          <Feather name="save" size={20} color="green" />
        </SafePressable>
      )}
      <YesNoModal
        title={t('components.planningLists.deleteListModal.title')}
        question={t('components.planningLists.deleteListModal.blurb')}
        visible={deleting}
        onYes={() => {
          if (isShoppingList) {
            deleteShoppingList(list.id);
          } else {
            deleteList(list.id);
          }
        }}
        onNo={() => {
          setDeleting(false);
        }}
        onRequestClose={() => {
          setDeleting(false);
        }}
      />
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
    </TransparentView>
  );
}

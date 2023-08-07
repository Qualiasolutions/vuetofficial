import { Feather } from '@expo/vector-icons';
import { Text, TextInput } from 'components/Themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  useCreatePlanningListItemMutation,
  useCreateShoppingListItemMutation,
  useCreateShoppingListStoreMutation,
  useGetAllShoppingListStoresQuery
} from 'reduxStore/services/api/lists';
import SafePressable from './SafePressable';
import { TransparentView } from './ViewComponents';
import { StyleSheet } from 'react-native';
import DropDown from 'components/forms/components/DropDown';
import { Modal } from './Modals';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { Button } from './ButtonComponents';

const addListItemStyles = StyleSheet.create({
  listInputPair: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 'auto',
    borderWidth: 0,
    borderBottomWidth: 1,
    width: 150
  },
  buttonWrapper: { alignItems: 'flex-start', flexDirection: 'row' },
  storeSelectorDropdown: { flexShrink: 1 },
  addStoreNameInput: {
    marginBottom: 10,
    width: '100%'
  },
  addStoreModalContent: { alignItems: 'center' }
});

const StoreSelector = ({
  onSelect,
  value
}: {
  onSelect: (storeId: number) => void;
  value: number | null;
}) => {
  const { data: shoppingListStores, isLoading: isLoadingStores } =
    useGetAllShoppingListStoresQuery(null as any);

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();

  const [createStore] = useCreateShoppingListStoreMutation();

  const { t } = useTranslation();
  const [addingNew, setAddingNew] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');

  const isLoading =
    isLoadingStores ||
    !shoppingListStores ||
    isLoadingUserDetails ||
    !userDetails;
  if (isLoading) {
    return null;
  }

  const dropDownItems = shoppingListStores.ids.map((storeId) => {
    const store = shoppingListStores.byId[storeId];
    return {
      value: `${storeId}`,
      label: store.name
    };
  });

  dropDownItems.push({
    value: 'NEW',
    label: t('components.planningLists.storeSelector.addNew')
  });

  return (
    <TransparentView style={addListItemStyles.storeSelectorDropdown}>
      <DropDown
        value={`${value}`}
        items={dropDownItems}
        setFormValues={(val) => {
          if (val === 'NEW') {
            setAddingNew(true);
          } else {
            onSelect(val);
          }
        }}
        listMode="MODAL"
        dropdownPlaceholder={t('components.planningLists.storeSelector.store')}
      />
      <Modal visible={addingNew}>
        <TransparentView style={addListItemStyles.addStoreModalContent}>
          <Text>{t('components.planningLists.storeSelector.nameBlurb')}</Text>
          <TextInput
            value={newStoreName}
            onChangeText={setNewStoreName}
            style={addListItemStyles.addStoreNameInput}
          />
          <TransparentView style={addListItemStyles.buttonWrapper}>
            <Button
              title={t('common.add')}
              onPress={async () => {
                try {
                  await createStore({
                    name: newStoreName,
                    created_by: userDetails.id
                  }).unwrap;
                  setNewStoreName('');
                  setAddingNew(false);
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
};

export default function AddListItemInputPair({
  sublist,
  list,
  isShoppingList
}: {
  sublist?: number;
  list?: number;
  isShoppingList?: boolean;
}) {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [newStoreId, setNewStoreId] = useState<number | null>(null);
  const [createPlanningListItem] = useCreatePlanningListItemMutation();
  const [createShoppingListItem] = useCreateShoppingListItemMutation();

  const onSubmitItem = async () => {
    if (newName) {
      try {
        setNewName('');
        if (list && isShoppingList) {
          await createShoppingListItem({
            list,
            store: newStoreId,
            title: newName
          }).unwrap();
        } else {
          if (sublist) {
            await createPlanningListItem({
              sublist,
              title: newName
            }).unwrap();
          }
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: t('common.errors.generic')
        });
      }
    }
  };

  return (
    <TransparentView>
      <TransparentView style={addListItemStyles.listInputPair}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addListItemStyles.input}
          blurOnSubmit={false}
          onSubmitEditing={onSubmitItem}
        />
        {isShoppingList && (
          <StoreSelector onSelect={setNewStoreId} value={newStoreId} />
        )}
        <TransparentView style={addListItemStyles.buttonWrapper}>
          <SafePressable onPress={onSubmitItem}>
            <Feather name="plus" size={24} color="green" />
          </SafePressable>
        </TransparentView>
      </TransparentView>
    </TransparentView>
  );
}

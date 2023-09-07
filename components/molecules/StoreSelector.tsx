import { Text, TextInput } from 'components/Themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  useCreateShoppingListStoreMutation,
  useGetAllShoppingListStoresQuery
} from 'reduxStore/services/api/lists';
import { TransparentView } from './ViewComponents';
import { StyleSheet } from 'react-native';
import DropDown from 'components/forms/components/DropDown';
import { Modal } from './Modals';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { Button } from './ButtonComponents';

const styles = StyleSheet.create({
  buttonWrapper: { alignItems: 'flex-start', flexDirection: 'row' },
  storeSelectorDropdown: { flexShrink: 1 },
  addStoreNameInput: {
    marginBottom: 10,
    width: '100%'
  },
  addStoreModalContent: { alignItems: 'center' },
  dropdownContainer: { maxWidth: 120 },
  dropdownText: { fontSize: 11 }
});

export default function StoreSelector({
  onSelect,
  value
}: {
  onSelect: (storeId: number) => void;
  value: number | null;
}) {
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
    <TransparentView style={styles.storeSelectorDropdown}>
      <DropDown
        containerStyle={styles.dropdownContainer}
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
        labelStyle={styles.dropdownText}
      />
      <Modal visible={addingNew} onRequestClose={() => setAddingNew(false)}>
        <TransparentView style={styles.addStoreModalContent}>
          <Text>{t('components.planningLists.storeSelector.nameBlurb')}</Text>
          <TextInput
            value={newStoreName}
            onChangeText={setNewStoreName}
            style={styles.addStoreNameInput}
          />
          <TransparentView style={styles.buttonWrapper}>
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
}

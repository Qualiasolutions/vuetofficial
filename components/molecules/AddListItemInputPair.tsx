import { Feather } from '@expo/vector-icons';
import { TextInput } from 'components/Themed';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useCreatePlanningListItemMutation } from 'reduxStore/services/api/lists';
import SafePressable from './SafePressable';
import { TransparentView } from './ViewComponents';
import { StyleSheet } from 'react-native';

const addListItemStyles = StyleSheet.create({
  listInputPair: { flexDirection: 'row', alignItems: 'center' },
  input: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 'auto',
    borderWidth: 0,
    borderBottomWidth: 1,
    width: 150
  },
  buttonWrapper: { alignItems: 'flex-start', flexDirection: 'row' }
});
export default function AddListItemInputPair({ sublist }: { sublist: number }) {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [createPlanningListItem] = useCreatePlanningListItemMutation();

  const onSubmitItem = async () => {
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
        <TransparentView style={addListItemStyles.buttonWrapper}>
          <SafePressable onPress={onSubmitItem}>
            <Feather name="plus" size={24} color="green" />
          </SafePressable>
        </TransparentView>
      </TransparentView>
    </TransparentView>
  );
}

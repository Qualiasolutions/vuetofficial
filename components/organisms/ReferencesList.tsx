import { Button } from 'components/molecules/ButtonComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import {
  useCreateReferenceMutation,
  useGetAllReferencesQuery
} from 'reduxStore/services/api/references';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { selectReferencesByEntityId } from 'reduxStore/slices/references/selectors';

const addReferenceStyles = StyleSheet.create({
  refInputPair: { flexDirection: 'row' },
  input: { flex: 1, marginRight: 10, marginVertical: 5 },
  buttonWrapper: { flex: 1, alignItems: 'flex-start' },
  button: { paddingVertical: 5 }
});
const AddReference = ({ entityId }: { entityId: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const { data: userDetails, isLoading: isLoadingUserDetails } =
    getUserFullDetails();
  const [createNewReference] = useCreateReferenceMutation();

  if (isLoadingUserDetails || !userDetails) {
    return null;
  }

  return (
    <TransparentView>
      <TransparentView style={addReferenceStyles.refInputPair}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addReferenceStyles.input}
        />
        <TextInput
          value={newValue}
          onChangeText={setNewValue}
          style={addReferenceStyles.input}
        />
      </TransparentView>
      <TransparentView style={addReferenceStyles.buttonWrapper}>
        <Button
          style={addReferenceStyles.button}
          disabled={!newName || !newValue}
          title={t('common.add')}
          onPress={async () => {
            try {
              setNewName('');
              setNewValue('');
              await createNewReference({
                name: newName,
                value: newValue,
                entities: [entityId],
                created_by: userDetails.id
              }).unwrap();
            } catch (err) {
              console.log(err);
              Toast.show({
                type: 'error',
                text1: t('common.errors.generic')
              });
            }
          }}
        />
      </TransparentView>
    </TransparentView>
  );
};

const refItemsStyles = StyleSheet.create({
  nameStyle: { marginRight: 20, fontWeight: 'bold' },
  refPair: { flexDirection: 'row' }
});
const ReferenceItem = ({ name, value }: { name: string; value: string }) => {
  return (
    <TransparentView style={refItemsStyles.refPair}>
      <Text style={refItemsStyles.nameStyle}>{name}</Text>
      <Text>{value}</Text>
    </TransparentView>
  );
};

const entityRefStyles = StyleSheet.create({
  container: { padding: 10 },
  nameTitle: { fontSize: 20 }
});
const EntityReferences = ({ entityId }: { entityId: number }) => {
  const references = useSelector(selectReferencesByEntityId(entityId));
  const entity = useSelector(selectEntityById(entityId));

  if (!entity) {
    return null;
  }

  const refViews = references
    .sort((a, b) => a.id > b.id)
    .map((ref) => (
      <ReferenceItem name={ref.name} value={ref.value} key={ref.id} />
    ));

  return (
    <TransparentView style={entityRefStyles.container}>
      <Text style={entityRefStyles.nameTitle}>{entity.name}</Text>
      {refViews}
      <AddReference entityId={entityId} />
    </TransparentView>
  );
};

export default function ReferencesList({ entities }: { entities?: number[] }) {
  const { data: allReferences, isLoading: isLoadingReferences } =
    useGetAllReferencesQuery();

  if (isLoadingReferences || !allReferences) {
    return <PaddedSpinner />;
  }

  const entitiesToShow: number[] =
    entities || Object.keys(allReferences.byEntity).map((id) => parseInt(id));

  const entityViews = entitiesToShow.map((entityId) => (
    <EntityReferences entityId={entityId} key={entityId} />
  ));

  return (
    <TransparentFullPageScrollView>{entityViews}</TransparentFullPageScrollView>
  );
}

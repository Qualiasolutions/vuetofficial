import { Feather } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import DateTimeTextInput from 'components/forms/components/DateTimeTextInput';
import { Button } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import SafePressable from 'components/molecules/SafePressable';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { TransparentView } from 'components/molecules/ViewComponents';
import { Text, TextInput, useThemeColor } from 'components/Themed';
import dayjs from 'dayjs';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  useCreateReferenceGroupMutation,
  useCreateReferenceMutation,
  useGetAllReferenceGroupsQuery,
  useGetAllReferencesQuery,
  useRetrievePasswordReferenceMutation
} from 'reduxStore/services/api/references';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import {
  selectReferenceById,
  selectReferenceGroupsByEntityId,
  selectReferencesByGroupId
} from 'reduxStore/slices/references/selectors';
import { RootTabParamList } from 'types/base';
import { Reference, ReferenceType } from 'types/references';

const addReferenceStyles = StyleSheet.create({
  refInputPair: { flexDirection: 'row', width: '100%' },
  input: { flex: 1, marginRight: 10, marginVertical: 5 },
  buttonWrapper: { flex: 1, alignItems: 'flex-start' },
  button: { paddingVertical: 5 },
  dropdown: { width: 130, marginRight: 10, flex: 0 }
});
const AddReference = ({ groupId }: { groupId: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<ReferenceType | ''>('');
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const borderColor = useThemeColor({}, 'grey');

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();
  const [createNewReference] = useCreateReferenceMutation();

  useEffect(() => {
    if (newType === 'DATE') {
      setNewValue('');
    }
  }, [newType]);

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
          placeholder={t('common.name')}
        />
        <DropDownPicker
          value={newType}
          items={[
            { value: 'NAME', label: 'Name' },
            { value: 'ACCOUNT_NUMBER', label: 'Account number' },
            { value: 'USERNAME', label: 'Username' },
            { value: 'PASSWORD', label: 'Password' },
            { value: 'WEBSITE', label: 'Website' },
            { value: 'NOTE', label: 'Note' },
            { value: 'ADDRESS', label: 'Address' },
            { value: 'PHONE_NUMBER', label: 'Phone number' },
            { value: 'DATE', label: 'Date' },
            { value: 'OTHER', label: 'Other' }
          ]}
          multiple={false}
          setValue={(item) => {
            if (item(null)) {
              setNewType(item(null));
            }
          }}
          open={typePickerOpen}
          setOpen={setTypePickerOpen}
          listMode="MODAL"
          placeholder={t('common.type')}
          containerStyle={addReferenceStyles.dropdown}
          style={{ borderColor }}
        />
        {newType === 'DATE' ? (
          <DateTimeTextInput
            value={newValue ? new Date(newValue) : null}
            onValueChange={(newDateValue: Date) => {
              setNewValue(dayjs(newDateValue).format('YYYY-MM-DD'));
            }}
            mode="date"
            textInputStyle={addReferenceStyles.input}
          />
        ) : (
          <TextInput
            value={newValue}
            onChangeText={setNewValue}
            style={addReferenceStyles.input}
            placeholder={t('common.value')}
          />
        )}
      </TransparentView>
      <TransparentView style={addReferenceStyles.buttonWrapper}>
        <Button
          style={addReferenceStyles.button}
          disabled={!newName || !newValue || !newType}
          title={t('common.add')}
          onPress={async () => {
            try {
              setNewName('');
              setNewValue('');
              await createNewReference({
                name: newName,
                value: newValue,
                type: newType || 'OTHER',
                group: groupId,
                created_by: userDetails.id
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
  );
};

const AddReferenceGroup = ({ entityId }: { entityId: number }) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();
  const [createNewReferenceGroup] = useCreateReferenceGroupMutation();

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
      </TransparentView>
      <TransparentView style={addReferenceStyles.buttonWrapper}>
        <Button
          style={addReferenceStyles.button}
          disabled={!newName}
          title={t('common.add')}
          onPress={async () => {
            try {
              setNewName('');
              await createNewReferenceGroup({
                name: newName,
                entities: [entityId],
                created_by: userDetails.id
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
  );
};

const passwordModalStyles = StyleSheet.create({
  passText: { marginBottom: 10 },
  passwordInput: { marginBottom: 10 }
});
const PasswordModal = ({
  onRequestClose,
  visible,
  reference
}: {
  onRequestClose: () => void;
  visible: boolean;
  reference: Reference;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [retrievePass, retrievePassResult] =
    useRetrievePasswordReferenceMutation();
  return (
    <Modal
      onRequestClose={() => {
        setValue('');
        setAccountPassword('');
        onRequestClose();
      }}
      visible={visible}
    >
      <TransparentView>
        <Text style={passwordModalStyles.passText}>
          {reference.name}: {value || '●●●●●●'}
        </Text>
        {!value && (
          <TransparentView>
            <Text>{t('components.referenceItem.passwordModal.blurb')}</Text>
            <TextInput
              secureTextEntry={true}
              style={passwordModalStyles.passwordInput}
              onChangeText={setAccountPassword}
              value={accountPassword}
            />

            {retrievePassResult.isLoading ? (
              <PaddedSpinner />
            ) : (
              <Button
                title={t('common.show')}
                onPress={async () => {
                  try {
                    const passObj = await retrievePass({
                      reference: reference.id,
                      password: accountPassword
                    }).unwrap();
                    setValue(passObj.value);
                  } catch (err) {
                    Toast.show({
                      type: 'error',
                      text1: t('common.errors.generic')
                    });
                  }
                }}
                disabled={!accountPassword}
              />
            )}
          </TransparentView>
        )}
      </TransparentView>
    </Modal>
  );
};

const refItemsStyles = StyleSheet.create({
  nameStyle: { marginRight: 20, fontWeight: 'bold' },
  refPair: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: {
    color: 'green',
    marginLeft: 10
  }
});
const ReferenceItem = ({ reference }: { reference: Reference }) => {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { t } = useTranslation();

  return (
    <TransparentView style={refItemsStyles.refPair}>
      <Text style={refItemsStyles.nameStyle}>{reference.name}</Text>
      <Text>{reference.type === 'PASSWORD' ? '●●●●●●' : reference.value}</Text>
      {reference.type === 'DATE' && (
        <SafePressable
          onPress={() => {
            navigation.navigate('AddTask', {
              title: reference.name,
              date: reference.value,
              type: 'DUE_DATE'
            });
          }}
        >
          <Feather
            name="plus"
            size={30}
            color="green"
            style={refItemsStyles.actionIcon}
          />
        </SafePressable>
      )}
      {reference.type === 'PASSWORD' && (
        <SafePressable
          onPress={() => {
            setShowPasswordModal(true);
          }}
        >
          <Feather
            name="eye"
            size={20}
            color="green"
            style={refItemsStyles.actionIcon}
          />
        </SafePressable>
      )}
      <PasswordModal
        onRequestClose={() => setShowPasswordModal(false)}
        visible={showPasswordModal}
        reference={reference}
      />
    </TransparentView>
  );
};

const entityRefStyles = StyleSheet.create({
  container: { padding: 10 },
  nameTitle: { fontSize: 20 }
});

const ReferenceGroupItem = ({ groupId }: { groupId: number }) => {
  const references = useSelector(selectReferencesByGroupId(groupId));
  const refGroup = useSelector(selectReferenceById(groupId));

  const refViews = references
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((ref) => <ReferenceItem reference={ref} key={ref.id} />);

  if (!refGroup) {
    return null;
  }

  return (
    <TransparentView style={entityRefStyles.container}>
      <Text style={entityRefStyles.nameTitle}>{refGroup.name}</Text>
      {refViews}
      <AddReference groupId={groupId} />
    </TransparentView>
  );
};

const EntityReferences = ({ entityId }: { entityId: number }) => {
  const referenceGroups = useSelector(
    selectReferenceGroupsByEntityId(entityId)
  );
  const entity = useSelector(selectEntityById(entityId));

  if (!entity) {
    return null;
  }

  const refViews = referenceGroups
    .sort((a, b) => (a.id > b.id ? 1 : -1))
    .map((refGroup) => (
      <ReferenceGroupItem groupId={refGroup.id} key={refGroup.id} />
    ));

  return (
    <TransparentView style={entityRefStyles.container}>
      <Text style={entityRefStyles.nameTitle}>{entity.name}</Text>
      {refViews}
      <AddReferenceGroup entityId={entityId} />
    </TransparentView>
  );
};

export default function ReferencesList({
  entities,
  categories
}: {
  entities?: number[];
  categories?: number[];
}) {
  const { data: allEntities } = useGetAllEntitiesQuery(null as any);
  const { data: allReferences, isLoading: isLoadingReferences } =
    useGetAllReferencesQuery();

  const { data: allReferenceGroups, isLoading: isLoadingReferenceGroups } =
    useGetAllReferenceGroupsQuery();

  if (
    isLoadingReferences ||
    isLoadingReferenceGroups ||
    !allReferences ||
    !allEntities ||
    !allReferenceGroups
  ) {
    return <PaddedSpinner />;
  }

  let entitiesToShow: number[] =
    entities ||
    Object.keys(allReferenceGroups.byEntity).map((id) => parseInt(id));

  if (categories) {
    entitiesToShow = entitiesToShow.filter((ent) =>
      categories.includes(allEntities.byId[ent].category)
    );
  }

  const entityViews = entitiesToShow.map((entityId) => (
    <EntityReferences entityId={entityId} key={entityId} />
  ));

  return (
    <TransparentFullPageScrollView>{entityViews}</TransparentFullPageScrollView>
  );
}

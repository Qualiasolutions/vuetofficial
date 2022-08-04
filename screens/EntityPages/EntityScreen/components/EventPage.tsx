import { useTranslation } from 'react-i18next';
import {
  useCreateEntityMutation,
  useGetAllEntitiesQuery,
  useUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import {
  TransparentContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { Pressable, StyleSheet } from 'react-native';
import {
  BlackText,
  PrimaryText,
  WhiteText
} from 'components/molecules/TextComponents';
import { TextInput, useThemeColor } from 'components/Themed';
import Layout from 'constants/Layout';
import EventListLink from 'components/molecules/EventListLink';
import { Modal } from 'components/molecules/Modals';
import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function EventScreen({ entityId }: { entityId: number }) {
  const [addNewModal, setAddNewModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [trigger, result] = useCreateEntityMutation();
  const [updateTrigger] = useUpdateEntityMutation();

  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });
  const entityData = allEntities?.byId[entityId];
  const { t } = useTranslation();

  const styles = style();

  const childEntityIds = entityData?.child_entities || [];
  const childEntityList = childEntityIds.map((id) => (
    <EventListLink
      key={id}
      text={allEntities?.byId[id].name || ''}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: id }}
      navMethod="push"
      selected={allEntities?.byId[id].selected}
      subType={allEntities?.byId[id].subtype}
      onSelect={async () => {
        const res = (await updateTrigger({
          resourcetype: allEntities?.byId[id].resourcetype,
          id,
          selected: !allEntities?.byId[id].selected
        })) as any;

        if (res && res?.error && res?.error.status >= 400) {
          throw Error('Network request error');
        }
      }}
    />
  ));

  const customLink = (
    <EventListLink
      text="Add New"
      customOnPress={() => {
        setAddNewModal(true);
      }}
      subType="add"
      style={{ marginTop: 20 }}
    />
  );

  const onAddNew = useCallback(() => {
    setAddNewModal(false);
    trigger({
      resourcetype: 'Event',
      name: itemName,
      parent: entityId
    });
  }, [useCreateEntityMutation, setAddNewModal, itemName]);

  const closeAddNewModal = useCallback(() => {
    setAddNewModal(false);
  }, [setAddNewModal]);

  return (
    <WhiteFullPageScrollView>
      <BlackText text={entityData?.name || ''} style={styles.name} />
      <TransparentContainerView style={styles.container}>
        {childEntityList}
        {customLink}
      </TransparentContainerView>

      <Modal visible={addNewModal}>
        <TransparentView style={styles.addNewContainer}>
          <Ionicons
            name="close-circle"
            size={30}
            style={{ alignSelf: 'flex-end' }}
            onPress={closeAddNewModal}
          />
          <PrimaryText text="Add a new" style={styles.addNewHeader} />
          <TextInput
            style={styles.input}
            onChangeText={setItemName}
            placeholder="Add title"
          />
          <Pressable
            disabled={itemName == ''}
            onPress={onAddNew}
            style={styles.addNewButton}
          >
            <WhiteText text="Save" />
          </Pressable>
        </TransparentView>
      </Modal>
    </WhiteFullPageScrollView>
  );
}

const style = function () {
  return StyleSheet.create({
    container: {},
    detailsContainer: {
      alignItems: 'center',
      marginBottom: 20
    },
    name: {
      fontSize: 26,
      textAlign: 'center'
    },
    birthDetail: {
      fontSize: 24
    },
    addNewContainer: {
      height: 198,
      width: Layout.window.width - 120,
      justifyContent: 'center',
      alignItems: 'center'
    },
    addNewHeader: {
      fontSize: 18
    },
    addNewButton: {
      backgroundColor: useThemeColor({}, 'buttonDefault'),
      height: 37,
      width: 152,
      borderRadius: 10,
      marginTop: 26,
      justifyContent: 'center',
      alignItems: 'center'
    },
    input: { width: '100%', flex: 0 }
  });
};

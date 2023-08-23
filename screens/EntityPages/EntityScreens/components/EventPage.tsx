import {
  useCreateEntityMutation,
  useGetAllEntitiesQuery,
  useUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import {
  AlmostBlackText,
  BlackText,
  PrimaryText,
  WhiteText
} from 'components/molecules/TextComponents';
import { TextInput, useThemeColor } from 'components/Themed';
import EventListLink from 'components/molecules/EventListLink';
import { Modal } from 'components/molecules/Modals';
import { useCallback, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SafePressable from 'components/molecules/SafePressable';

const useStyle = function () {
  return StyleSheet.create({
    container: {
      paddingTop: 10,
      paddingBottom: 100
    },
    addNewContainer: {
      height: 198,
      width: '100%',
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
    input: { width: '100%', flex: 0 },
    info: {
      fontSize: 16
    },
    infoContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 20
    },
    rightContainer: {
      marginLeft: 20
    }
  });
};

export default function EventScreen({ entityId }: { entityId: number }) {
  const [addNewModal, setAddNewModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [createTrigger] = useCreateEntityMutation();
  const [updateTrigger] = useUpdateEntityMutation();

  const { t } = useTranslation();

  const { data: allEntities } = useGetAllEntitiesQuery(null as any);
  const entityData = allEntities?.byId[entityId];

  const styles = useStyle();

  const childEntityIds = entityData?.child_entities || [];

  const childEntityList = childEntityIds.map((id) => {
    return (
      <EventListLink
        key={id}
        text={allEntities?.byId[id].name || ''}
        toScreen="EntityScreen"
        toScreenParams={{ entityId: id }}
        navMethod="push"
        selected={!allEntities?.byId[id].hidden}
        subType={allEntities?.byId[id].subtype}
        onSelect={async () => {
          const res = (await updateTrigger({
            resourcetype: allEntities?.byId[id].resourcetype,
            id,
            hidden: !allEntities?.byId[id].hidden
          })) as any;

          if (res && res?.error && res?.error.status >= 400) {
            throw Error('Network request error');
          }
        }}
      />
    );
  });

  const customLink = (
    <EventListLink
      text="Add New"
      onPressContainer={() => {
        setAddNewModal(true);
      }}
      subType="add"
      style={{ marginTop: 20 }}
    />
  );

  const onAddNew = useCallback(() => {
    setAddNewModal(false);
    createTrigger({
      resourcetype: 'List',
      name: itemName,
      parent: entityId
    });
  }, [setAddNewModal, createTrigger, entityId, itemName]);

  const closeAddNewModal = useCallback(() => {
    setAddNewModal(false);
  }, [setAddNewModal]);

  return (
    <WhiteFullPageScrollView>
      <TransparentView style={styles.infoContainer}>
        <FontAwesome
          name="thumb-tack"
          size={20}
          style={{
            transform: [{ rotateZ: '45deg' }]
          }}
          color={useThemeColor({}, 'primary')}
        />
        <TransparentView style={styles.rightContainer}>
          <BlackText
            text={t('screens.eventPage.thingsToDo')}
            style={styles.info}
          />
          <AlmostBlackText
            text={t('common.pleaseSelect')}
            style={styles.info}
          />
        </TransparentView>
      </TransparentView>
      <TransparentPaddedView style={styles.container}>
        {childEntityList}
        {customLink}
      </TransparentPaddedView>

      <Modal visible={addNewModal}>
        <TransparentView style={styles.addNewContainer}>
          <Ionicons
            name="close-circle"
            size={30}
            style={{ alignSelf: 'flex-end' }}
            onPress={closeAddNewModal}
          />
          <PrimaryText text={t('common.addNew')} style={styles.addNewHeader} />
          <TextInput
            style={styles.input}
            onChangeText={setItemName}
            placeholder={t('common.addTitle')}
          />
          <SafePressable
            disabled={itemName == ''}
            onPress={onAddNew}
            style={styles.addNewButton}
          >
            <WhiteText text={t('common.save')} />
          </SafePressable>
        </TransparentView>
      </Modal>
    </WhiteFullPageScrollView>
  );
}

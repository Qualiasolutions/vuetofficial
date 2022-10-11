import React, { useCallback, useState } from 'react';
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
  getDateWithoutTimezone,
  getDaysToAge,
  getLongDateFromDateObject
} from 'utils/datesAndTimes';
import {
  AlmostBlackText,
  BlackText,
  PrimaryText,
  WhiteText
} from 'components/molecules/TextComponents';
import ListLinkWithCheckBox from 'components/molecules/ListLinkWithCheckbox';
import { Modal } from 'components/molecules/Modals';
import { TextInput, useThemeColor } from 'components/Themed';
import Layout from 'constants/Layout';
import { Ionicons } from '@expo/vector-icons';

export default function HolidayScreen({ entityId }: { entityId: number }) {
  const [addNewModal, setAddNewModal] = useState(false);
  const [trigger, result] = useCreateEntityMutation();
  const [updateTrigger] = useUpdateEntityMutation();

  const [itemName, setItemName] = useState('');

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

  const startDate = getDateWithoutTimezone(entityData?.start_date);
  const { age, monthName, date, year } = getDaysToAge(startDate);

  const styles = style();

  const startDateString = getLongDateFromDateObject(
    getDateWithoutTimezone(entityData?.start_date)
  );
  const endDateString = getLongDateFromDateObject(
    getDateWithoutTimezone(entityData?.end_date)
  );

  const holidayDetails = (
    <TransparentView style={styles.detailsContainer}>
      <AlmostBlackText
        style={styles.birthDetail}
        text={`${startDateString}${
          entityData?.end_date !== entityData?.start_date
            ? ` to ${endDateString}`
            : ''
        }`}
      />
    </TransparentView>
  );

  const eventLink = (
    <ListLinkWithCheckBox
      text="Event"
      toScreen="EntityList"
      toScreenParams={{
        entityTypes: ['Event'],
        entityTypeName: 'events'
      }}
      navMethod="push"
    />
  );

  const travelLink = (
    <ListLinkWithCheckBox
      text="Travel"
      toScreen="EntityList"
      toScreenParams={{
        entityTypes: ['Trip'],
        entityTypeName: 'trips'
      }}
      navMethod="push"
    />
  );

  const childEntityIds = entityData?.child_entities || [];
  const childEntityList = childEntityIds.map((id) => (
    <ListLinkWithCheckBox
      key={id}
      text={allEntities?.byId[id].name || ''}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: id }}
      navMethod="push"
      selected={allEntities?.byId[id].selected}
      onSelect={async () => {
        const res = (await updateTrigger({
          resourcetype: 'List',
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
    <ListLinkWithCheckBox
      text={`+ ${t('common.addNew')}`}
      onPressContainer={() => {
        setAddNewModal(true);
      }}
    />
  );

  const onAddNew = useCallback(() => {
    setAddNewModal(false);
    trigger({
      resourcetype: 'List',
      name: itemName,
      parent: entityId
    });
  }, [useCreateEntityMutation, setAddNewModal, itemName]);

  const closeAddNewModal = useCallback(() => {
    setAddNewModal(false);
  }, [setAddNewModal]);

  return (
    <WhiteFullPageScrollView>
      <TransparentContainerView style={styles.container}>
        <BlackText text={entityData?.name || ''} style={styles.name} />
        {holidayDetails}
        {eventLink}
        {travelLink}
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
          <PrimaryText text={t('common.addNew')} style={styles.addNewHeader} />
          <TextInput
            style={styles.input}
            onChangeText={setItemName}
            placeholder={t('common.addTitle')}
          />
          <Pressable
            disabled={itemName == ''}
            onPress={onAddNew}
            style={styles.addNewButton}
          >
            <WhiteText text={t('common.save')} />
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
      fontSize: 26
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

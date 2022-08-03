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

export default function BirthdayScreen({ entityId }: { entityId: number }) {
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
  const { age, monthName, date } = getDaysToAge(startDate);

  const styles = style();

  const birthdayDetails = (
    <TransparentView style={styles.detailsContainer}>
      <AlmostBlackText
        style={styles.birthDetail}
        text={`${age} on ${monthName} ${date}, 2023`}
      />
    </TransparentView>
  );

  const phoneLink = (
    <ListLinkWithCheckBox text="Phone or text" toScreen="" navMethod="push" />
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
      text="+ Add New"
      customOnPress={() => {
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

  return (
    <WhiteFullPageScrollView>
      <TransparentContainerView style={styles.container}>
        <BlackText text={entityData?.name || ''} style={styles.name} />
        {birthdayDetails}
        {phoneLink}
        {eventLink}
        {childEntityList}
        {customLink}
      </TransparentContainerView>

      <Modal visible={addNewModal}>
        <TransparentView style={styles.addNewContainer}>
          <PrimaryText text="Add a new" style={styles.addNewHeader} />
          <TextInput onChangeText={setItemName} placeholder="Add title" />
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
    }
  });
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import ListLink from 'components/molecules/ListLink';
import {
  TransparentContainerView,
  TransparentView,
  WhiteBox,
  WhiteContainerView
} from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import {
  getDateWithoutTimezone,
  getLongDateFromDateObject
} from 'utils/datesAndTimes';
import { AlmostBlackText, BlackText } from 'components/molecules/TextComponents';
import ListLinkWithCheckBox from 'components/molecules/ListLinkWithCheckbox';
import { Feather } from '@expo/vector-icons';

const getNextDate = (startDate: Date): Date => {
  const startDateCopy = new Date(startDate.getTime());
  const dateNow = new Date();
  while (startDateCopy < dateNow) {
    // Pretty inefficient
    startDateCopy.setFullYear(startDateCopy.getFullYear() + 1);
  }
  return startDateCopy;
};

const getDaysToAge = (startDate: Date): { days: number; age: number } => {
  const nextOccurrence = getNextDate(startDate);
  const todayDate = new Date();
  const millisecondsDifference = nextOccurrence.getTime() - todayDate.getTime();
  const daysDifference = Math.ceil(
    millisecondsDifference / (1000 * 60 * 60 * 24)
  );
  const age = nextOccurrence.getFullYear() - startDate.getFullYear();

  return {
    days: daysDifference,
    age
  };
};

export default function BirthdayScreen({ entityId }: { entityId: number }) {
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
  const { days, age } = getDaysToAge(startDate);

  const birthdayDetails = (
    <TransparentView style={styles.detailsContainer}>
      <AlmostBlackText style={styles.birthDetail}  text={getLongDateFromDateObject(startDate)} />
      <AlmostBlackText style={styles.birthDetail} text={`Turns ${age} in ${days} days`} />
    </TransparentView>
  );

  const childEntityIds = entityData?.child_entities || [];
  const childEntityList = childEntityIds.map((id) => (
    <ListLinkWithCheckBox
      key={id}
      text={allEntities?.byId[id].name || ''}
      toScreen="EntityScreen"
      toScreenParams={{ entityId: id }}
      navMethod="push"
      selected={true}
    />
  ));

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

  const phoneLink = (
    <ListLinkWithCheckBox
      text="Phone or text"
      toScreen=""
      navMethod="push"
    />
  );

  const customLink = (
    <ListLinkWithCheckBox
      text="Custom - Define later"
      toScreen=""
      navMethod="push"
    />
  );

  return (
    <WhiteFullPageScrollView>
      <TransparentContainerView>
        <Feather name='user' size={100} />
        <BlackText text={entityData?.name || ''} style={styles.name} />
        {birthdayDetails}
        {childEntityList}
        {eventLink}
        {phoneLink}
        {customLink}
      </TransparentContainerView>
    </WhiteFullPageScrollView>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  name: {
    fontSize: 26,
  },
  birthDetail: {
    fontSize: 18,
  }
});

import { StyleSheet } from 'react-native';
import { useThemeColor } from 'components/Themed';
import React from 'react';
import { useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { BlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import ColourBar from 'components/molecules/ColourBar';
import { ParsedPeriod } from 'types/periods';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { ITEM_HEIGHT } from './shared';
import EntityTags from 'components/molecules/EntityTags';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  titleContainer: {
    flex: 1
  },
  title: {
    fontSize: 14,
    textAlign: 'left'
  },
  containerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});

type PropTypes = { period: ParsedPeriod };

export default function OneDayPeriod({ period }: PropTypes) {
  const { data: userDetails } = getUserFullDetails();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.id || -1);

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const familyMembersList = userFullDetails?.family?.users?.filter(
    (item: any) => period.members.includes(item.id)
  );
  const friendMembersList = userFullDetails?.friends?.filter((item: any) =>
    period.members.includes(item.id)
  );

  const membersList = [
    ...(familyMembersList || []),
    ...(friendMembersList || [])
  ];

  const entities = period.entities.map((entity) => allEntities.byId[entity]);

  const memberColour = (
    <TransparentView pointerEvents="none" style={styles.memberColor}>
      <ColourBar
        colourHexcodes={
          membersList?.map(({ member_colour }) => member_colour) || []
        }
      />
    </TransparentView>
  );

  return (
    <TransparentView
      style={{ borderBottomWidth: 1, paddingVertical: 5, height: ITEM_HEIGHT }}
    >
      <TransparentView style={[styles.containerWrapper]}>
        <TransparentView style={styles.container}>
          <TransparentView style={styles.titleContainer}>
            <BlackText text={period.title} style={[styles.title]} bold={true} />
          </TransparentView>
        </TransparentView>
      </TransparentView>
      <TransparentView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}
      >
        <TransparentView
          style={{ flexDirection: 'row', width: '50%', flex: 0 }}
        >
          <EntityTags entities={entities} />
        </TransparentView>
        {memberColour}
      </TransparentView>
    </TransparentView>
  );
}

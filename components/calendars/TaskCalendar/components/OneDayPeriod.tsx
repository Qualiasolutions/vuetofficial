import { Pressable, StyleSheet } from 'react-native';
import { useThemeColor, View } from 'components/Themed';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { WhiteText, BlackText } from 'components/molecules/TextComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParsedPeriod } from 'types/periods';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { Image } from 'components/molecules/ImageComponents';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';

type PropTypes = { period: ParsedPeriod; };

export default function OneDayPeriod({ period }: PropTypes) {
  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();

  const [selected, setSelected] = useState(false)
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

  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const entity = allEntities.byId[period.entity];

  const familyMembersList = userFullDetails?.family?.users?.filter(
    (item: any) =>
      period.members.includes(item.id) || (entity && entity.owner === item.id)
  );
  const friendMembersList = userFullDetails?.friends?.filter(
    (item: any) =>
      period.members.includes(item.id) || (entity && entity.owner === item.id)
  );

  const membersList = [
    ...(familyMembersList || []),
    ...(friendMembersList || [])
  ];

  const leftInfo = <View style={styles.leftInfo} />;

  const expandedHeader =
    entity && selected ? (
      <Pressable
        onPress={() => setSelected(false)}
        style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
      >
        <WhiteText
          text={entity?.name}
          style={styles.expandedTitle}
          bold={true}
        />
        <Pressable
          onPress={() =>
            (navigation.navigate as any)('EntityNavigator', {
              screen: 'EditEntity',
              initial: false,
              params: { entityId: entity.id }
            })
          }
          style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
        >
          <Image
            source={require('assets/images/edit.png')}
            style={styles.editImage}
          />
        </Pressable>
      </Pressable>
    ) : null;

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
    <WhiteView
      style={[
        styles.container,
        entity &&
        selected && {
          ...styles.selectedTask,
          borderColor: greyColor
        }
      ]}
    >
      {expandedHeader}
      <View
        style={[
          styles.touchableContainerWrapper,
          selected && styles.selectedTouchableContainer
        ]}
      >
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => {
            setSelected(true)
          }}
        >
          {leftInfo}
          <View style={styles.titleContainer}>
            <BlackText text={period.title} style={styles.title} bold={true} />
          </View>
        </TouchableOpacity>
      </View>
      {memberColour}
      {!selected && <View style={styles.separator}></View>}
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  titleContainer: {
    width: '60%',
    flex: 1
  },
  title: {
    fontSize: 14,
    textAlign: 'left'
  },
  leftInfo: {
    width: '20%',
    marginRight: 0,
    marginLeft: 0
  },
  touchableContainerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  touchableContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee'
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 13,
    height: 53
  },
  expandedTitle: {
    fontSize: 18
  },
  editImage: {
    height: 27,
    width: 31
  },
  selectedTask: {
    paddingTop: 0,
    overflow: 'hidden',
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.16,
    elevation: 5,
    borderWidth: 1
  },
  selectedTouchableContainer: { alignItems: 'flex-start', marginTop: 20 },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});

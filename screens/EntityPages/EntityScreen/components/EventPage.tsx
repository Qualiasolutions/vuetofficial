import { useTranslation } from 'react-i18next';
import {
  useGetAllEntitiesQuery,
  useUpdateEntityMutation
} from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { TransparentContainerView } from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { BlackText } from 'components/molecules/TextComponents';
import { useThemeColor } from 'components/Themed';
import Layout from 'constants/Layout';
import EventListLink from 'components/molecules/EventListLink';

export default function EventScreen({ entityId }: { entityId: number }) {
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
      onSelect={async () => {}}
    />
  ));

  return (
    <WhiteFullPageScrollView>
      <BlackText text={entityData?.name || ''} style={styles.name} />
      <TransparentContainerView style={styles.container}>
        {childEntityList}
      </TransparentContainerView>
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
      textAlign:'center'
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

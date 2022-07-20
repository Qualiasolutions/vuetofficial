import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { RootTabScreenProps } from 'types/base';
import { TransparentView, WhiteView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';

type EntityListScreenProps = RootTabScreenProps<'EntityList'>;

export default function EntityListScreen({ navigation, route }: EntityListScreenProps) {
    const username = useSelector(selectUsername);
    const { data: userDetails } = useGetUserDetailsQuery(username);
    const { data: allEntities, isLoading, error } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
        skip: !userDetails?.user_id
    });
  const entityData = Object.values(allEntities?.byId || {}).filter(entity => entity.resourcetype === route.params.entityType)
  const { t } = useTranslation()

  useEffect(() => {
    navigation.setOptions({
      title: t(`entityTypes.${route.params.entityType}`)
    });
  }, [route.params.entityType]);

  const listLinks = entityData?.map(entity => (
    <Pressable key={entity.id} onPress={() => navigation.navigate('EntityScreen', { entityId: entity.id })}>
      <WhiteView style={styles.listEntry}>
        <AlmostBlackText text={t(entity.name)} style={styles.listEntryText}/>
        <Image source={require('../../assets/images/icons/arrow-right.png')}/>
      </WhiteView>
    </Pressable>
  ))

  return (
    <TransparentView>
      {listLinks}
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity:  0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  listEntryText: {
    fontSize: 20
  }
});

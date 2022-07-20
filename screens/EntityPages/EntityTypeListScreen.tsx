import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { RootTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { TransparentView, WhiteView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';

type EntityTypeListScreenProps = RootTabScreenProps<'EntityTypeList'>;

export default function EntityTypeListScreen({ navigation, route }: EntityTypeListScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery()
  const categoryData = allCategories?.byId[route.params.categoryId]
  const permittedResourceTypes = categoryData?.model_types?.map(type => type.model_name)

  const { t } = useTranslation()

  useEffect(() => {
    navigation.setOptions({
      title: t(`categories.${categoryData?.name}`)
    });
  }, [allCategories]);

  const listLinks = permittedResourceTypes?.map(resourceType => (
    <Pressable key={resourceType} onPress={() => navigation.navigate('EntityList', { entityType: resourceType })}>
      <WhiteView style={styles.listEntry}>
        <AlmostBlackText text={t(`entityTypes.${resourceType}`)} style={styles.listEntryText}/>
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

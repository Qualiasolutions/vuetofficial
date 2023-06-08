import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { styles } from './style';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import DropDown from 'components/molecules/DropDownView';
import { t } from 'i18next';
import { Text } from 'components/Themed';
import { RootTabParamList } from 'types/base';
import { Category } from 'types/categories';
import { EntityParsedType, EntityResponseType } from 'types/entities';
import { ListingModal } from 'components/molecules/Modals';
import Search from 'components/molecules/Search';
import Asterisk from 'components/molecules/Asterisk';

export default function CreateTask({
  navigation
}: NativeStackScreenProps<RootTabParamList, 'CreateTask'>) {
  const [showListing, setShowListing] = useState(false);
  const [modalData, setModalData] = useState<{
    options: Category[] | EntityResponseType[];
  }>({ options: [] });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>();
  const [selectedEntity, setSelectedEntity] =
    useState<EntityParsedType | null>();
  const { data: Categories, isLoading, error } = useGetAllCategoriesQuery();
  const { data: Entities } = useGetAllEntitiesQuery();

  useEffect(() => {
    navigation.addListener('focus', () => {
      setSelectedCategory(null);
      setSelectedEntity(null);
    });
  }, [navigation]);

  const [showEntityListing, setShowEntityListing] = useState(false);

  const onCloseCategory = useCallback(() => {
    setShowListing(false);
  }, [setShowListing]);

  const onselectCategory = useCallback(
    (category) => {
      setSelectedCategory(category);
      onCloseCategory();
      setSelectedEntity(null);
    },
    [setSelectedCategory, onCloseCategory]
  );

  const onCloseEntity = useCallback(() => {
    setShowEntityListing(false);
  }, [setShowEntityListing]);

  const onSelectEntity = useCallback(
    (entity) => {
      setSelectedEntity(entity);
      onCloseEntity();
      navigation.navigate('AddTask', { entityId: entity?.id });
    },
    [setSelectedEntity, onCloseEntity, navigation]
  );

  const allEntities = Object.values(Entities?.byId || []);
  const allCategories = Object.values(Categories?.byId || []);

  return (
    <WhiteView style={styles.container}>
      <Search />

      <TransparentView style={{ marginTop: 18 }}>
        <TransparentView style={styles.dropDownContainer}>
          <Text>
            {t('common.category')}
            <Asterisk />{' '}
          </Text>
          <DropDown
            value={selectedCategory?.readable_name}
            onPress={() => {
              setModalData({ options: allCategories });
              setShowListing(!showListing);
            }}
          />
        </TransparentView>
        <TransparentView style={styles.dropDownContainer}>
          <Text>
            {t('common.thing')}
            <Asterisk />{' '}
          </Text>
          <DropDown
            disabled={selectedCategory == null}
            value={selectedEntity?.name}
            onPress={() => {
              setModalData({
                options: allEntities.filter(
                  (entity) => entity.category == selectedCategory?.id
                )
              });
              setShowEntityListing(!showEntityListing);
            }}
          />
        </TransparentView>
      </TransparentView>

      <ListingModal
        visible={showListing}
        data={modalData}
        itemToName={(item) => t(`categories.${item.name}`)}
        onClose={onCloseCategory}
        onSelect={onselectCategory}
      />

      <ListingModal
        visible={showEntityListing}
        data={modalData}
        onClose={onCloseEntity}
        onSelect={onSelectEntity}
      />
    </WhiteView>
  );
}

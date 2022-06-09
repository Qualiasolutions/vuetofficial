import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from 'components/Themed';
import { Category as CategoryType } from 'types/categories';

import { DARK } from 'globalStyles/colorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import GenericError from 'components/molecules/GenericError';
import { useTranslation } from 'react-i18next';

type CategoriesTypes = RootTabScreenProps<'Categories'>;

export default function CategoriesGrid({ navigation }: CategoriesTypes) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const { t } = useTranslation();

  if (isLoading || !allCategories) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const categoriesContent = Object.values(allCategories.byId).map(
    (category: CategoryType) => {
      const textColor = category.is_enabled ? DARK : DARK + '44';
      const isEnabled = category.is_enabled;

      const isPremiumTag = category.is_premium ? (
        <View style={styles.premiumTag}>
          <Text style={styles.premiumTagText}>Premium</Text>
        </View>
      ) : null;

      return (
        <Pressable
          onPress={() => {
            navigation.navigate('Transport');
          }}
          style={styles.gridSquare}
          disabled={!isEnabled}
          key={category.id}
        >
          <Text style={[styles.gridText, { color: textColor }]}>
            {t(`categories.${category.name}`)}
          </Text>
          {isPremiumTag}
        </Pressable>
      );
    }
  );

  const categoriesPage = (
    <View style={styles.gridContainer}>{categoriesContent}</View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>{categoriesPage}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridSquare: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '32%',
    height: '32%',
    padding: 10,
    margin: 1,
    borderWidth: 1,
    borderColor: DARK
  },
  gridText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  premiumTag: {
    backgroundColor: '#FFC700',
    padding: 5,
    margin: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 3,
    right: 3
  },
  premiumTagText: {
    fontSize: 10,
    color: 'white'
  }
});

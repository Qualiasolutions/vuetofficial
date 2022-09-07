import React from 'react';
import { ImageBackground, Pressable, StyleSheet } from 'react-native';

import { Text, useThemeColor, View } from 'components/Themed';
import { Category as CategoryType } from 'types/categories';

import { SafeAreaView } from 'react-native-safe-area-context';
import { EntityTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import GenericError from 'components/molecules/GenericError';
import { useTranslation } from 'react-i18next';
import Layout from 'constants/Layout';
import { FullPageSpinner } from 'components/molecules/Spinners';

const categoriesImages = {
  FAMILY: require('assets/images/categories/family.png'),
  PETS: require('assets/images/categories/pets.png'),
  SOCIAL_INTERESTS: require('assets/images/categories/social.png'),
  EDUCATION_CAREER: require('assets/images/categories/education.png'),
  TRAVEL: require('assets/images/categories/travel.png'),
  HEALTH_BEAUTY: require('assets/images/categories/health.png'),
  HOME_GARDEN: require('assets/images/categories/home.png'),
  FINANCE: require('assets/images/categories/finance.png'),
  TRANSPORT: require('assets/images/categories/transport.png')
};

type CategoriesTypes = EntityTabScreenProps<'Categories'>;

export default function CategoriesGrid({ navigation }: CategoriesTypes) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const { t } = useTranslation();

  const whiteColor = useThemeColor({}, 'white');
  const overlayColor = useThemeColor({}, 'overlay');
  const blackColor = useThemeColor({}, 'black');

  if (isLoading || !allCategories) {
    return <FullPageSpinner />;
  }

  if (error) {
    return <GenericError />;
  }

  const categoriesContent = Object.values(allCategories.byId).map(
    (category: CategoryType) => {
      const textColor = category.is_enabled ? whiteColor : blackColor;
      const isEnabled = category.is_enabled;

      const isPremiumTag = category.is_premium ? (
        <View style={styles.premiumTag}>
          <Text style={styles.premiumTagText}>Premium</Text>
        </View>
      ) : null;

      return (
        <Pressable
          onPress={() => {
            navigation.navigate('EntityTypeList', { categoryId: category.id });
          }}
          disabled={!isEnabled}
          key={category.id}
        >
          <ImageBackground
            source={categoriesImages[category.name]}
            style={styles.gridSquare}
            resizeMode="cover"
          >
            <View
              style={[styles.overlay, { backgroundColor: `${overlayColor}99` }]}
            >
              <Text style={[styles.gridText, { color: textColor }]}>
                {t(`categories.${category.name}`)}
              </Text>
              {isPremiumTag}
            </View>
          </ImageBackground>
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
    width: Layout.window.width / 3 - 17,
    height: Layout.window.height * 0.2,
    margin: 2.5,
    overflow: 'hidden',
    borderRadius: 10
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
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10
  }
});

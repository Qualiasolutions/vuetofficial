import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from 'components/Themed';
import { useSelector } from 'react-redux';
import { selectAllCategories } from 'reduxStore/slices/categories/selectors';
import { Category as CategoryType } from 'types/categories';

import { DARK } from 'globalStyles/colorScheme';

export default function CategoriesGrid({ navigation }: any) {
  const allCategories = useSelector(selectAllCategories);
  console.log(allCategories);

  const categoriesContent = Object.values(allCategories.byId).map(
    (category: CategoryType) => {
      const textColor = category.is_enabled ? DARK : DARK + '44';
      const isEnabled = category.is_enabled;
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
            {category.readable_name}
          </Text>
        </Pressable>
      );
    }
  );

  const categoriesPage = (
    <View style={styles.gridContainer}>{categoriesContent}</View>
  );

  return <View style={styles.container}>{categoriesPage}</View>;
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
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gridSquare: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
    height: '33%',
    padding: 10,
    borderWidth: 1,
    borderColor: DARK
  },
  gridText: {
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

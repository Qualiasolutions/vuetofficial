import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from 'components/Themed';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import { selectAllCategories } from 'reduxStore/slices/categories/selectors';
import { isSuccessfulResponseType, makeAuthorisedRequest } from 'utils/makeAuthorisedRequest';
import { Category as CategoryType } from 'types/categories';
import { setAllCategories } from 'reduxStore/slices/categories/actions';

import Constants from 'expo-constants';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export default function CategoriesScreen() {
  const [loadingCategories, setLoadingCategories] = React.useState<boolean>(true);

  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);
  const allCategories = useSelector(selectAllCategories);

  const getAllcategories = (): void => {
    setLoadingCategories(true);
    makeAuthorisedRequest<CategoryType[]>(
      jwtAccessToken,
      `http://${vuetApiUrl}/core/category/`
    ).then((res) => {
      if (isSuccessfulResponseType<CategoryType[]>(res)) {
        dispatch(setAllCategories(res.response));
        setLoadingCategories(false);
      }
    });
  };
  React.useEffect(getAllcategories, []);

  const loadingScreen = (
    <View style={styles.spinnerWrapper}>
      <ActivityIndicator size="large" />
    </View>
  );

  const categoriesContent = Object.values(allCategories.byId).map((category: CategoryType)  => <View key={category.id}> <Text> {category.name} </Text> </View>)
  const pageContent = loadingCategories ? loadingScreen : categoriesContent;

  return (
    <View style={styles.container}>
      {pageContent}
    </View>
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
  }
});
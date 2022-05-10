import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Splash from './screens/SplashScreen';

import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit';
import reducer from './reduxStore/reducers';
import { EntireState } from './reduxStore/types';

import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { RootAction } from 'reduxStore/actions';
import {
  loadAllTasks,
  loadAllCategories,
  loadAllEntities
} from 'hooks/loadObjects/loadObjectsHooks';
import { View } from 'components/Themed';
import { ActivityIndicator, StyleSheet } from 'react-native';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer<CombinedState<EntireState>, RootAction>(
  persistConfig,
  reducer
);

const store = configureStore({
  reducer: pReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
const persistor = persistStore(store);

const styles = StyleSheet.create({
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

// Any data that needs to be loaded at the start should be loaded here
const DataProvider = ({ children }: { children: any }) => {
  const loadedTasks = loadAllTasks();
  const loadedCategories = loadAllCategories();
  const loadedEntities = loadAllEntities();

  const allLoaded = loadedTasks && loadedCategories && loadedEntities;
  if (allLoaded) {
    return children;
  }
  const loadingScreen = (
    <View style={styles.spinnerWrapper}>
      <ActivityIndicator size="large" />
    </View>
  );
  return loadingScreen;
};

export default function App() {
  const loadedCachedResources = useCachedResources();
  const colorScheme = useColorScheme();

  if (!loadedCachedResources) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={<Splash />} persistor={persistor}>
          <SafeAreaProvider>
            <DataProvider>
              <Navigation colorScheme={colorScheme} />
            </DataProvider>
            <StatusBar />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}

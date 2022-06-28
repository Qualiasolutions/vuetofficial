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
import { vuetApi } from 'reduxStore/services/api/api';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import './i18n/i18n';



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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(vuetApi.middleware)
});
const persistor = persistStore(store);

setupListeners(store.dispatch);

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
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}

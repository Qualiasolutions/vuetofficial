import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Splash from './screens/SplashScreen';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { CombinedState } from '@reduxjs/toolkit';
import reducer from './redux/reducers';
import { AuthReducerActionType, EntireState } from './redux/types';

import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer<
  CombinedState<EntireState>,
  AuthReducerActionType
>(persistConfig, reducer);

const store = configureStore({ reducer: pReducer });
const persistor = persistStore(store);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
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

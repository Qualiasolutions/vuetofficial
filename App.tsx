import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Splash from './screens/SplashScreen';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { enableFreeze } from 'react-native-screens';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { EventProvider } from 'react-native-outside-press';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [vuetApi.reducerPath],
  stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer<CombinedState<EntireState>, RootAction>(
  persistConfig,
  reducer as any
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

enableFreeze();

const styles = StyleSheet.create({
  root: { width: '100%', height: '100%' },
  eventProvider: { flex: 1 }
});

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
            <EventProvider style={styles.eventProvider}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <GestureHandlerRootView style={styles.root}>
                  <Navigation colorScheme={colorScheme} />
                </GestureHandlerRootView>
              </KeyboardAvoidingView>
              <StatusBar translucent={true} />
              <Toast position="bottom" />
            </EventProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}

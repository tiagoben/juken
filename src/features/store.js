import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native';
import localForage from 'localforage';
import * as r from 'src/common/resources';
import device from 'src/utils/device';

import wk from 'src/features/wk/state';

const wkPersist = {
  key: 'wk',
  storage: device('mobile') ? AsyncStorage : localForage,
  whitelist: [r.USER, r.API_KEY]
}

export const store = configureStore({
  reducer: combineReducers({
    wk: persistReducer(wkPersist, wk),
  }),
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  })
})

export const persistor = persistStore(store);

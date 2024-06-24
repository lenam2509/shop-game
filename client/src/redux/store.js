import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/auth'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

const persistAuthConfig = {
  key: 'auth',
  storage: storage,
}

const persistAuthReducer = persistReducer(persistAuthConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      {
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'],
        },
      },
    )

})

export const persistor = persistStore(store)


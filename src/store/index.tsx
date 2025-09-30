import adminSlice, { AdminState } from '@/store/slices/adminSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist config for admin/auth only
const adminPersistConfig = {
  key: 'admin',
  storage,
};

const rootReducer = combineReducers({
  admin: persistReducer(adminPersistConfig, adminSlice),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = {
  admin: AdminState;
};
export type AppDispatch = typeof store.dispatch;

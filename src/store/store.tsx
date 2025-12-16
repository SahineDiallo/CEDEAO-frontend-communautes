import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import tabsReducer from './features/tabs/tabsSlice';
import authReducer from './features/auth/authSlice';
import communitiesReducer from './features/communities/CommunitySlice';
import communityDetailsReducer from './features/communities/CommunityDetailsSlice';
import categoriesReducer from './features/categories/categoriesSlice'

// Create unique persist configurations for each reducer
const tabsPersistConfig = {
  key: 'tabs',
  storage,
};

const authPersistConfig = {
  key: 'auth',
  storage,
};

const communitiesPersistConfig = {
  key: 'communities',
  storage,
};

const categoriesPersistConfig = {
  key: "community categories",
  storage,
}

const communityDetailsPersistConfig = {
  key: 'communityDetails',
  storage,
};

// Wrap each reducer with persistReducer and unique config
const persistedTabsReducer = persistReducer(tabsPersistConfig, tabsReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCommunitiesReducer = persistReducer(communitiesPersistConfig, communitiesReducer);
const persistedCategoriesReducer = persistReducer(categoriesPersistConfig, categoriesReducer)
const persistedCommunityDetailsReducer = persistReducer(communityDetailsPersistConfig, communityDetailsReducer);

// Configure the store
const store = configureStore({
  reducer: {
    tabs: persistedTabsReducer,
    auth: persistedAuthReducer,
    communities: persistedCommunitiesReducer,
    categories: persistedCategoriesReducer,
    communityDetails: persistedCommunityDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore redux-persist actions
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;

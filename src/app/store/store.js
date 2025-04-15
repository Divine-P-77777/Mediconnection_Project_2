import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";
import themeReducer from "./themeSlice";
import businessReducer from "./businessSlice"; // ✅ Renamed to `businessReducer` for clarity

// Persist config for theme
const themePersistConfig = {
  key: "theme",
  storage,
  whitelist: ["isDarkMode"]
};

// Persist config for business
const businessPersistConfig = {
  key: "business",
  storage,
  whitelist: ["selectedBusiness"]
};

// Combine reducers
const rootReducer = combineReducers({
  theme: persistReducer(themePersistConfig, themeReducer),
  business: persistReducer(businessPersistConfig, businessReducer), // ✅ Now persisted
});

// Create store with middleware configuration
export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });

  store.__persistor = persistStore(store);
  return store;
};

// Export the store and persistor
export const store = makeStore();
export const persistor = store.__persistor;

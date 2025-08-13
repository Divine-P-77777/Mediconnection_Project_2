import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import themeReducer from "./themeSlice";

// Persist config for theme
const themePersistConfig = {
  key: "theme",
  storage,
  whitelist: ["isDarkMode"]
};

// Combine reducers (only theme now)
const rootReducer = combineReducers({
  theme: persistReducer(themePersistConfig, themeReducer),
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

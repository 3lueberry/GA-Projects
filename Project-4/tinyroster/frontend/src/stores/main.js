import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./auth";
import loaderReducer from "./loader";

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("tiny-roster", jsonValue);
  } catch (e) {
    // saving error
  }
};

const localStorageMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);
    storeData({ auth: getState().auth });
    return result;
  };
};

// const getData = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem("tiny-roster");
//     return jsonValue != null ? JSON.parse(jsonValue) : null;
//   } catch (e) {
//     // error reading value
//   }
// };

// const reStore = async () => {
//   const data = await getData();
//   console.log(data);
//   if (data !== null) {
//     return { ...data };
//   }
// };

const reducers = combineReducers({
  auth: authReducer,
  loader: loaderReducer,
});

const persistConfig = {
  key: "tiny-roster",
  storage: AsyncStorage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  // preloadedState: reStore(),
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// export default store;
export const persistor = persistStore(store);

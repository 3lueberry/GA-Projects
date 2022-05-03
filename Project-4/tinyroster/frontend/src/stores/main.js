import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./auth";
// import loaderReducer from "./loader";

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
    storeData({
      auth: getState().auth,
    });
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

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // preloadedState: reStore(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;

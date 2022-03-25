import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import userReducer from "./user";
import chatReducer from "./chat";
import loaderReducer from "./loader";

const localStorageMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);
    localStorage.setItem("state", JSON.stringify(getState()));
    return result;
  };
};

const reStore = () => {
  if (localStorage.getItem("state") !== null) {
    return JSON.parse(localStorage.getItem("state")); // re-hydrate the store
  }
};

const store = configureStore({
  reducer: { user: userReducer, auth: authReducer, loader: loaderReducer, chat: chatReducer },
  preloadedState: reStore(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;

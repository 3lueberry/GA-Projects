import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import userReducer from "./user";
import chatReducer from "./chat";
import loaderReducer from "./loader";

const store = configureStore({
  reducer: { user: userReducer, auth: authReducer, loader: loaderReducer, chat: chatReducer },
});

export default store;

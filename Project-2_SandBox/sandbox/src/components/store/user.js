import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    login: false,
  },
  reducers: {
    usernameChange(state, action) {
      state.username = action.payload.trim();
    },
    login(state, action) {
      state.username = action.payload;
      state.login = true;
    },
    logout(state) {
      state.username = "";
      state.login = false;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

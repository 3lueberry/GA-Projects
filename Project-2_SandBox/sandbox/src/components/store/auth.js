import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    refresh: null,
    time: 0,
  },
  reducers: {
    setAuth(state, action) {
      console.log("token refreshed", new Date());
      state.token = action.payload.token;
      state.refresh = action.payload.refresh;
      state.time = Date.now();
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;

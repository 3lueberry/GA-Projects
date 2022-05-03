import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
    error: null,
  },
  reducers: {
    setIsLoading(state) {
      state.isLoading = true;
    },
    doneLoading(state) {
      state.isLoading = false;
    },
    setError(state, action) {
      state.error = {};
      state.error.title = action.payload.title;
      state.error.message = action.payload.message;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const loaderActions = loaderSlice.actions;
export default loaderSlice.reducer;

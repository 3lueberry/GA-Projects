import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "messages",
  initialState: { rooms: null, pinned: [], messages: null, textInput: "", textArea: 1 },

  reducers: {
    setMessages(state, action) {
      // console.log("setMessages", action.payload);
      state.messages = action.payload;
    },

    setRooms(state, action) {
      // console.log("setRooms", action.payload);
      state.rooms = action.payload;
    },

    setPinMsg(state, action) {
      // console.log("setRooms", action.payload);
      state.pinned = action.payload;
    },

    addPinMsg(state, action) {
      // console.log("addPinMsg", action.payload);
      state.pinned = [...state.pinned, action.payload];
      console.log(state.pinned, action.payload);
    },

    textInputChange(state, action) {
      let lines = (action.payload.match(/\n/g) || []).length + 1;
      state.textInput = action.payload.length < 2 ? action.payload.trim() : action.payload;
      state.textArea = lines < 3 ? lines : 3;
    },
  },
});

export const chatActions = chatSlice.actions;
export default chatSlice.reducer;

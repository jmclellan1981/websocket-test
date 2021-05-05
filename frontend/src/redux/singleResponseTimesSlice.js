import { createSlice } from "@reduxjs/toolkit";

const singleReplyData = createSlice({
  name: "SINGLE_REPLY_RESPONSE_TIMES",
  initialState: {
    charsReceived: 0,
    objectsReceived: 0,
    percentDone: 0,
    responseTimes: [],
  },
  reducers: {
    updatePercentDone: (state, action) => {
      state.percentDone = action.payload;
    },
    updateCharsReceived: (state, action) => {
      state.charsReceived += action.payload;
    },
    updateObjectsReceived: (state, action) => {
      state.objectsReceived += action.payload;
    },
    addResponseTime: (state, action) => {
      state.responseTimes.push(action.payload);
    },
    resetData: (state, action) => {
      state.charsReceived = 0;
      state.objectsReceived = 0;
      state.percentDone = 0;
    },
  },
});

export const {
  updatePercentDone,
  updateCharsReceived,
  updateObjectsReceived,
  addResponseTime,
  resetData,
} = singleReplyData.actions;

export default singleReplyData.reducer;

import { configureStore } from "@reduxjs/toolkit";
import multiReplyData from "./multiResponseTimesSlice";
import singleData from "./singleResponseTimesSlice";

export default configureStore({
  reducer: {
    singleReplyData: singleData,
    multiReplyData: multiReplyData,
  },
});

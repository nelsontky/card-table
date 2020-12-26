import { configureStore } from "@reduxjs/toolkit";
import yoursReducer from "./slices/yoursSlice";

export default configureStore({
  reducer: {
    yours: yoursReducer,
  },
});

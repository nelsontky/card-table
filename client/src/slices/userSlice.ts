import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import firebase from "firebase";

export const slice = createSlice({
  name: "user",
  initialState: false as string | boolean,
  reducers: {
    login: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
    logout: () => {
      firebase.auth().signOut();
      axios.defaults.headers["Authorization"] = undefined;
      window.location.href = "/";
      return false;
    },
  },
});

export const { login, logout } = slice.actions;

export default slice.reducer;

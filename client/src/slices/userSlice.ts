import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import firebase from "firebase";

export const slice = createSlice({
  name: "user",
  initialState: false as string | false,
  reducers: {
    login: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
    logout: () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          axios.defaults.headers["Authorization"] = undefined;
          window.location.href = "/";
        });

      return false as false;
    },
  },
});

export const { login, logout } = slice.actions;

export default slice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "playerId",
  initialState: -1,
  reducers: {
    set: (_, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { set } = slice.actions;

export default slice.reducer;

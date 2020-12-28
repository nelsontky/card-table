import { createSlice } from "@reduxjs/toolkit";

import { Card } from "../interfaces";
import { SetGamePayload, CrudGamePayload } from "./interfaces";
import { removeFromArray } from "../lib/utils";
import { LeakAddTwoTone } from "@material-ui/icons";

const initialState = [
  {
    deck: Array<Card>(),
    hand: Array<Card>(),
    play: Array<Card>(),
  },
];

export const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    set: (state, action: SetGamePayload) => {
      const { playerId, section, cards } = action.payload;
      state[playerId][section] = cards;
    },
    add: (state, action: CrudGamePayload) => {
      const { playerId, section, card } = action.payload;
      state[playerId][section].push(card);
    },
    remove: (state, action: CrudGamePayload) => {
      const { playerId, section, card } = action.payload;
      state[playerId][section] = removeFromArray(
        (element) => element.id === card.id,
        state[playerId][section]
      );
    },
    update: (state, action: CrudGamePayload) => {
      const { playerId, section, card } = action.payload;
      let edited = removeFromArray(
        (element) => element.id === card.id,
        state[playerId][section]
      );
      edited.push(card);
      state[playerId][section] = edited;
    },
  },
});

export const { add, remove, update, set } = slice.actions;

export default slice.reducer;

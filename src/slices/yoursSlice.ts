import { createSlice } from "@reduxjs/toolkit";

import { Card, Section } from "../interfaces";
import { removeFromArray } from "../lib/utils";

export const slice = createSlice({
  name: "yours",
  initialState: {
    deck: Array<Card>(),
    hand: Array<Card>(),
    play: Array<Card>(),
  },
  reducers: {
    set: (state, action: { payload: { section: Section; cards: Card[] } }) => {
      const { section, cards } = action.payload;
      state[section] = cards;
    },
    add: (state, action: { payload: { section: Section; card: Card } }) => {
      const { section, card } = action.payload;
      state[section].push(card);
    },
    remove: (state, action: { payload: { section: Section; id: number } }) => {
      const { section, id } = action.payload;
      state[section] = removeFromArray(
        (element) => element.id === id,
        state[section]
      );
    },
    update: (state, action: { payload: { section: Section; card: Card } }) => {
      const { section, card } = action.payload;
      const edited = removeFromArray(
        (element) => element.id === card.id,
        state[section]
      );
      edited.push(card);
      state[section] = edited;
    },
  },
});

export const { add, remove, update, set } = slice.actions;

export default slice.reducer;

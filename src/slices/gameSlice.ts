import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Card, Section, SetGame, CrudGame } from "../interfaces";
import { removeFromArray } from "../lib/utils";

const initialState = [
  {
    deck: Array<Card>(),
    hand: Array<Card>(),
    play: Array<Card>(),
  },
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
    set: (state, action: PayloadAction<SetGame>) => {
      const { playerId, section, cards } = action.payload;
      state[playerId][section] = cards;
    },
    add: (state, action: PayloadAction<CrudGame>) => {
      const { playerId, section, card, addToFront } = action.payload;

      if (addToFront) {
        state[playerId][section].unshift(card);
      } else {
        state[playerId][section].push(card);
      }
    },
    remove: (state, action: PayloadAction<CrudGame>) => {
      const { playerId, section, card } = action.payload;
      state[playerId][section] = removeFromArray(
        (element) => element.id === card.id,
        state[playerId][section]
      );
    },
    update: (state, action: PayloadAction<CrudGame>) => {
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

export const flip = (playerId: number, card: Card) => (
  dispatch: any,
  getState: any
) => {
  const allCards = getState().game[playerId];
  const sections = Object.keys(allCards) as Section[];

  for (let section of sections) {
    const found = allCards[section].find(
      (currCard: Card) => currCard.id === card.id
    );

    if (found) {
      dispatch(
        update({
          playerId,
          section,
          card: { ...found, isFaceDown: !found.isFaceDown },
        })
      );

      return;
    }
  }
};

export const rotate = (playerId: number, card: Card, angle: number) => (
  dispatch: any,
  getState: any
) => {
  const allCards = getState().game[playerId];
  const sections = Object.keys(allCards) as Section[];

  for (let section of sections) {
    const found = allCards[section].find(
      (currCard: Card) => currCard.id === card.id
    );

    if (found) {
      let newAngle = (found.angle + angle) % 360;
      newAngle = newAngle < 0 ? 360 + newAngle : newAngle;

      dispatch(
        update({
          playerId,
          section,
          card: { ...found, angle: newAngle },
        })
      );

      return;
    }
  }
};

export default slice.reducer;

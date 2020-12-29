import shuffle from "lodash/shuffle";
import { v4 as uuidv4 } from "uuid";

import { Card } from "../interfaces";
import dragonicForce from "../decks/dragonicForce.json";

export function removeFromArray(pred: (element: any) => boolean, arr: any[]) {
  let copy = [...arr];
  const indexToRemove = copy.findIndex(pred);
  copy.splice(indexToRemove, 1);
  return copy;
}

export function createDeck({
  deckName,
  noShuffle,
}: {
  deckName: string;
  noShuffle?: boolean;
}) {
  const deck = dragonicForce.reduce((acc, curr) => {
    const next = [...acc];
    for (let i = 0; i < curr.quantity; i++) {
      next.push({
        cardId: curr.id,
        id: uuidv4(),
        isFaceDown: true,
        angle: 0,
      });
    }
    return next;
  }, Array<Card>());

  return noShuffle ? deck : shuffle(deck);
}

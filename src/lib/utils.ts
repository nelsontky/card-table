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

export function transformCoords(peerData: any) {
  const { width, height, offsetTop, offsetLeft, card, ...rest } = peerData;
  const { x, y } = card;

  const myPlayZone = document.getElementById("play-zone");
  if (
    !width ||
    !height ||
    !offsetTop ||
    !offsetLeft ||
    !x ||
    !y ||
    !myPlayZone
  ) {
    return peerData;
  }

  const widthScale = width / myPlayZone.clientWidth;
  const heightScale = height / myPlayZone.clientHeight;
  const translateX = myPlayZone.offsetLeft - offsetLeft;
  const translateY = myPlayZone.offsetTop - offsetTop;

  const newX = x / widthScale + translateX;
  const newY =
    myPlayZone.offsetTop + (y - offsetTop) / heightScale + translateY;

  return {
    ...rest,
    card: { ...card, x: newX, y: newY },
  };
}

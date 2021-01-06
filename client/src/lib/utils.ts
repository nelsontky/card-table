import shuffle from "lodash/shuffle";
import { v4 as uuidv4 } from "uuid";

import { Card } from "../interfaces";
import decks from "../decks.json";

export function removeFromArray(pred: (element: any) => boolean, arr: any[]) {
  let copy = [...arr];
  const indexToRemove = copy.findIndex(pred);
  copy.splice(indexToRemove, 1);
  return copy;
}

export function createDeck({
  deckName,
  deckCards,
  noShuffle,
  ownerId,
}: {
  deckName?: string;
  deckCards?: Array<any>;
  noShuffle?: boolean;
  ownerId: number;
}) {
  const allDecks: any = decks;
  const cardsToAdd = deckName
    ? allDecks[deckName]
    : deckCards
    ? deckCards.map((card: any) => ({ ...card, ...card.card }))
    : [];
  const deck = cardsToAdd.reduce((acc: any, curr: any) => {
    const next = [...acc];
    for (let i = 0; i < curr.quantity; i++) {
      next.push({
        cardId: curr.id,
        id: uuidv4(),
        isFaceDown: true,
        angle: 0,
        ownerId,
      });
    }
    return next;
  }, Array<Card>());

  return noShuffle ? deck : shuffle(deck);
}

export function transformCoords(peerData: any) {
  const { card, cardHeight, ...rest } = peerData;
  const boundingRect: DOMRect = peerData.boundingRect;

  if (!card) {
    return peerData;
  }

  const { x, y, angle } = card;

  const myPlayZone = document.getElementById("play-zone");
  if (!x || !y || !myPlayZone || !boundingRect) {
    return peerData;
  }
  const myBoundingRect = myPlayZone.getBoundingClientRect();

  // TODO account for more players in diff directions
  const widthScale = boundingRect.width / myBoundingRect.width;
  const heightScale = boundingRect.height / myBoundingRect.height;
  const translateX = myBoundingRect.left - boundingRect.left;
  const translateY = myBoundingRect.top - boundingRect.top;

  const newX = x / widthScale + translateX;
  let newY = y / heightScale + translateY;
  newY = reflectX(newY, cardHeight);

  return {
    ...rest,
    card: { ...card, x: newX, y: newY, angle: angle + 180 },
  };
}

function reflectX(y: number, cardHeight?: number) {
  const myPlayZone = document.getElementById("play-zone") as HTMLElement;
  const myBoundingRect = myPlayZone.getBoundingClientRect();
  const yMiddle = myBoundingRect.top + myBoundingRect.height / 2;

  return -(y - yMiddle) + yMiddle - (cardHeight ? cardHeight : 0);
}

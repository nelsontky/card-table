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
  console.log(peerData);
  const { width, height, offsetTop, offsetLeft, card, ...rest } = peerData;
  const { x, y, angle } = card;

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

  // TODO account for more players in diff directions
  const widthScale = width / myPlayZone.clientWidth;
  const heightScale = height / myPlayZone.clientHeight;
  const translateX = myPlayZone.offsetLeft - offsetLeft;
  const translateY = myPlayZone.offsetTop - offsetTop;

  const newX = x / widthScale + translateX;
  const transformedY =
    myPlayZone.offsetTop + (y - offsetTop) / heightScale + translateY;
  const newY =
    -(transformedY - document.body.clientHeight / 2) +
    document.body.clientHeight / 2 -
    52.5; // TODO get height dynamically

  return {
    ...rest,
    card: { ...card, x: newX, y: newY, angle: angle + 180 },
  };
}

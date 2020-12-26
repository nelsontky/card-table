export interface Card {
  id: number;
  cardId: string;
  x?: number;
  y?: number;
}

export type Section = "deck" | "hand" | "play";

export type ICardComponent = {
  card: Card;
  source: Section;
  faceDown?: boolean;
  dropCb?: (element: any) => void;
  [x: string]: any;
};

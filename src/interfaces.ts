import { XYCoord } from "react-dnd";

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

export interface Monitor {
  canDrop?: boolean;
  isOver?: boolean;
  clientOffset?: XYCoord | null;
  card?: Card;
}

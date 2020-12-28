import { XYCoord } from "react-dnd";

export interface Card {
  id: number;
  cardId: string;
  isFaceDown: boolean;
  x?: number;
  y?: number;
}

export type Section = "deck" | "hand" | "play";

export type DragItem = Card & {
  type: Section;
};

export type ICardComponent = {
  card: Card;
  source: Section;
  dropCb?: (element: DragItem) => void;
  [x: string]: any;
};

export interface Monitor {
  canDrop?: boolean;
  isOver?: boolean;
  clientOffset?: XYCoord | null;
  card?: Card;
}

export interface PlayerState {
  deck: Card[];
  hand: Card[];
  play: Card[];
}

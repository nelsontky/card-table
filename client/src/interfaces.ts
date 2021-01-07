import { XYCoord } from "react-dnd";

export interface Card {
  id: string;
  cardId: string;
  ownerId: number;
  isFaceDown: boolean;
  angle: number;
  x?: number;
  y?: number;
}

export type Section = "deck" | "hand" | "play";

export type DragItem = Card & {
  type: Section;
};

export interface Monitor {
  canDrop?: boolean;
  isOver?: boolean;
  clientOffset?: XYCoord | null;
  card?: Card;
  isMine?: boolean;
}

export interface PlayerState {
  deck: Card[];
  hand: Card[];
  play: Card[];
}

export type Size = "small" | "medium" | "large";

export interface SetGame {
  playerId: number;
  section: Section;
  cards: Card[];
}

export interface CrudGame {
  playerId: number;
  section: Section;
  card: Card;
  addToFront?: boolean;
}

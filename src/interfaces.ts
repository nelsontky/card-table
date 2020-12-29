import React from "react";
import { XYCoord, DragSourceMonitor } from "react-dnd";

export interface Card {
  id: string;
  cardId: string;
  isFaceDown: boolean;
  angle: number;
  x?: number;
  y?: number;
}

export type Section = "deck" | "hand" | "play";

export type DragItem = Card & {
  type: Section;
};

export interface ICardMenu {
  card: Card;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  [x: string]: any;
}

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

export interface IClosableBackdrop {
  isOpen: boolean;
  close: () => void;
  children: React.ReactChild | React.ReactChildren;
  [x: string]: any;
}

export type Size = "small" | "medium" | "large";

export interface ICardComponent {
  card: Card;
  source: Section;
  dropCb?: (element: DragItem, monitor: DragSourceMonitor) => void;
  noDrag?: boolean;
  disableActions?: boolean;
  size?: Size;
  [x: string]: any;
}

export interface IHandZone {
  playerId: number;
  size?: Size;
  [x: string]: any;
}

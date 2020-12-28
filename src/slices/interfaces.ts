import { PayloadAction } from "@reduxjs/toolkit";

import { Card, Section } from "../interfaces";

export type SetGamePayload = PayloadAction<{
  playerId: number;
  section: Section;
  cards: Card[];
}>;

export type CrudGamePayload = PayloadAction<{
  playerId: number;
  section: Section;
  card: Card;
}>;
